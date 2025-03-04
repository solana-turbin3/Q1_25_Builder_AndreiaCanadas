use anchor_lang::{
    prelude::*, solana_program::native_token::LAMPORTS_PER_SOL, system_program::{
        transfer, 
        Transfer
    }
};

use mpl_core::{
    accounts::BaseAssetV1, 
    fetch_plugin, 
    instructions::UpdatePluginV1CpiBuilder, 
    types::{
        Attribute, 
        Attributes, 
        Plugin,
    }
};

use crate::{
        constants::{UserMilestone, VerificationStatus}, errors::DonaSolError, state::{
        Donations,
        Profile, 
        User, 
        VaultState
    }
};

#[derive(Accounts)]
pub struct Donate<'info> {
    #[account(mut)]
    pub donor: Signer<'info>,
    #[account(mut)]
    pub admin: SystemAccount<'info>,
    #[account(
        mut,
        // constraint = profile.verification_status == VerificationStatus::Verified,
    )]
    pub profile: Account<'info, Profile>,
    #[account(
        init_if_needed,
        payer = donor,
        seeds = [b"donor", donor.key().as_ref(), profile.key().as_ref()],
        bump,
        space = User::INIT_SPACE,
    )]
    pub user_account: Account<'info, User>,

    #[account(
        seeds = [b"state", profile.key().as_ref()],
        bump = vault_state.state_bump,
    )]
    pub vault_state: Account<'info, VaultState>,
    #[account(
        mut,
        seeds = [b"vault", vault_state.key().as_ref()],
        bump = vault_state.vault_bump,
    )]
    pub vault: SystemAccount<'info>,
    /// CHECK: This account should be updated with the new NFT attributes values
    #[account(mut)]
    pub core_nft_account: AccountInfo<'info>,
    /// CHECK: This is the ID of the Metaplex Core program
    #[account(address = mpl_core::ID)]
    pub mpl_core_program: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> Donate<'info> {
    pub fn donate(&mut self, amount: u64) -> Result<()> {
        // If project campaign deadline has ended
        if Clock::get()?.unix_timestamp >= self.profile.start_date + self.profile.duration as i64 {
            return err!(DonaSolError::DeadlineEnded);
        }

        let fee = amount / 100;
        let amount_to_transfer = amount - fee;

        let minimum_lamports_exemption = Rent::get()?.minimum_balance(self.vault.to_account_info().data_len());

        // Check if the amount is enough to cover the minimum balance
        if amount_to_transfer < minimum_lamports_exemption {
            return err!(DonaSolError::InsufficientAmount);
        }
        
        let cpi_program = self.system_program.to_account_info();

        // Transfer amount to vault
        let cpi_accounts = Transfer {
            from: self.donor.to_account_info(),
            to: self.vault.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(cpi_program.clone(), cpi_accounts);

        transfer(cpi_ctx, amount)?;

        // Transfer fees to admin
        let cpi_accounts = Transfer {
            from: self.donor.to_account_info(),
            to: self.admin.to_account_info(),
        };

        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        transfer(cpi_ctx, fee)?;

        self.update_donation_track(amount_to_transfer)?;

        self.update_user_account(amount_to_transfer)?;

        self.update_user_nft(amount_to_transfer)?;

        Ok(())
    }

    pub fn update_donation_track(&mut self, amount: u64) -> Result<()> {

        // if entry for the donor already exist -> update total amount donated
        if let Some(donation) = self.profile.donations_list.iter_mut().find(|donation| donation.donor == self.donor.key()) {
            donation.amount += amount;
        }
        // if new donor -> create new entry
        else {
            let new_donation = Donations {
                donor: self.donor.key(),
                amount,
            };
            
            self.profile.donations_list.push(new_donation);
        }

        Ok(())
    }

    pub fn update_user_account(&mut self, amount: u64) -> Result<()> {

        self.user_account.amount_donated += amount;
        self.user_account.last_donation_date = Clock::get()?.unix_timestamp;

        Ok(())
    }

    pub fn update_user_nft(&mut self, amount: u64) -> Result<()> {

        let (_, fetched_attributes, _) = fetch_plugin::<BaseAssetV1, Attributes>(
            &self.core_nft_account.to_account_info(),
            mpl_core::types::PluginType::Attributes,
        )?;

        let mut attribute_list: Vec<Attribute> = Vec::new();

        let mut total_amount: u64 = 0;

        for attribute in &fetched_attributes.attribute_list {
            if attribute.key == "Total amount donated" {
                total_amount = attribute.value.parse::<u64>().unwrap().checked_add(amount).unwrap();
            }
        }
        let total_points = total_amount * 10;

        let user_milestone = if total_amount >= 500 * LAMPORTS_PER_SOL {
            UserMilestone::GenerosityGuru
        } else if total_amount >= 350 * LAMPORTS_PER_SOL {
            UserMilestone::KindnessKnight
        } else if total_amount >= 200 * LAMPORTS_PER_SOL {
            UserMilestone::CharityChampion
        } else if total_amount >= 100 * LAMPORTS_PER_SOL {
            UserMilestone::GenerosityGrasshopper
        } else {
            UserMilestone::DonorNewbie
        };

        for attribute in fetched_attributes.attribute_list {
            if attribute.key == "Bagde" {
                attribute_list.push(Attribute {
                    key: "Bagde".to_string(),
                    value: user_milestone.to_string(),
                });
            } else if attribute.key == "Total amount donated" {
                attribute_list.push(Attribute {
                    key: "Total amount donated".to_string(), 
                    value: total_amount.to_string(),
                });
            } else if attribute.key == "Points" {
                attribute_list.push(Attribute {
                    key: "Points".to_string(),
                    value: total_points.to_string(),
                });
            }else {
                attribute_list.push(attribute);
            }
        }

        UpdatePluginV1CpiBuilder::new(&self.mpl_core_program.to_account_info())
        .asset(&self.core_nft_account.to_account_info())
        .payer(&self.donor.to_account_info())
        .system_program(&self.system_program.to_account_info())
        .plugin(Plugin::Attributes(Attributes { attribute_list}))
        .invoke()?;
        
    Ok(())
    }

}