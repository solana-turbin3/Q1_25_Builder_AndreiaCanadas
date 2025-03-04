use anchor_lang::prelude::*;

use mpl_core::{
    instructions::CreateV1CpiBuilder, 
    types::{
        Attribute, 
        Attributes, 
        DataState, 
        PluginAuthorityPair
    }
};

use crate::{
    constants::UserMilestone, 
    state::{
        Profile, 
        User
    }
};

#[derive(Accounts)]
#[instruction(_profile_name: String)]
pub struct InitUser<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init,
        payer = user,
        seeds = [b"donor", user.key().as_ref(), _profile_name.as_bytes()],
        bump,
        space = User::INIT_SPACE,
    )]
    pub user_account: Account<'info, User>,
    pub profile: Account<'info, Profile>,
    /// CHECK: This is the mint account of the asset to be minted
    #[account(mut)]
    pub mint: Signer<'info>,
    /// CHECK: This is the ID of the Metaplex Core program
    #[account(address = mpl_core::ID)]
    pub mpl_core_program: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> InitUser<'info> {

    pub fn init_user_account(&mut self, _profile_name: String, bumps: InitUserBumps) -> Result<()> {

        self.user_account.set_inner(User {
            owner: self.user.key(),
            profile: self.profile.key(),
            amount_donated: 0,
            last_donation_date: Clock::get()?.unix_timestamp,
            bump: bumps.user_account,
        });
        Ok(())
    }

    pub fn mint_profile_nft(&mut self, user_name: String) -> Result<()> {
        if self.mint.owner != &mpl_core::ID {
            CreateV1CpiBuilder::new(&self.mpl_core_program.to_account_info())
                .asset(&self.mint.to_account_info())
                .collection(None)
                .authority(Some(&self.user.to_account_info()))
                .payer(&self.user.to_account_info())
                .owner(Some(&self.user.to_account_info()))
                .update_authority(None)
                .system_program(&self.system_program.to_account_info())
                .data_state(DataState::AccountState)
                .name("DonaSol Profile".to_string())
                .uri("".to_string())
                .plugins(vec![PluginAuthorityPair {
                    plugin: mpl_core::types::Plugin::Attributes(Attributes { attribute_list: 
                        vec![
                            Attribute { 
                                key: "Name".to_string(), 
                                value: user_name, 
                            },
                            Attribute { 
                                key: "Since".to_string(),
                                value: Clock::get()?.unix_timestamp.to_string(), 
                            },
                            Attribute { 
                                key: "Bagde".to_string(),
                                value: UserMilestone::DonorNewbie.to_string(),
                            },
                            Attribute { 
                                key: "Total amount donated".to_string(), 
                                value: "0".to_string(), 
                            },
                            Attribute { 
                                key: "Points".to_string(),
                                value: "0".to_string(), 
                            },
                        ]
                    }), 
                    authority: None
                }])
                .invoke()?;
        }
        Ok(())
    }
}