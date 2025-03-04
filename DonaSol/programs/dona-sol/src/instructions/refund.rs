use anchor_lang::{
    prelude::*, 
    system_program::{
        transfer,
        Transfer
    }};

use crate::{
    constants::REFLECTION_PERIOD, 
    errors::DonaSolError, 
    state::{
        Profile, 
        User,
        VaultState,
}};

#[derive(Accounts)]
#[instruction(profile_name: String)]
pub struct Refund<'info> {
    #[account(mut)]
    pub donor: Signer<'info>,
    pub profile: Account<'info, Profile>,
    #[account(
        mut,
        close = donor,
        seeds = [b"donor", donor.key().as_ref(), profile_name.as_bytes()],
        bump = user_account.bump,
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

    pub system_program: Program<'info, System>,
}

// TBD: Think what else needs to be done when doing a refund
// TBD: User account and core NFT updates
impl<'info> Refund<'info> {

    // Is there any checks that need to be done or is it safe enough?
    pub fn refund_donor(&mut self, _profile_name: String) -> Result<()> {

        // Check if project deadline has been reached
        if Clock::get()?.unix_timestamp - self.profile.start_date >= self.profile.duration as i64 {
            // Profile target reached -> Throw error: Refund not available (project milestone completed)
            if self.profile.target >= self.profile.target {         // TBD: GET TOTAL AMOUNT COLLECTED
                return err!(DonaSolError::RefundErrorMilestoneCompleted);
            }
        }
        // If still within project duration, check if reflection period has elapsed
        // Reflection Period has elapsed -> Throw error: Refund not available (reflection period has elapsed)
        if Clock::get()?.unix_timestamp - self.user_account.last_donation_date >= REFLECTION_PERIOD as i64 {
            return err!(DonaSolError::RefundErrorReflectionPeriod);
        }

        // Refund Donor if no error condition has been met

        let vault_state_key = self.vault_state.key();
        let seeds = &[
            b"vault",
            vault_state_key.as_ref(),
            &[self.vault_state.vault_bump]
        ];     
        let signer_seeds = &[&seeds[..]];

        let cpi_program = self.system_program.to_account_info();

        let cpi_accounts = Transfer {
            from: self.vault.to_account_info(),
            to: self.donor.to_account_info(),
        };

        let cpi_context = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

        let amount = self.user_account.amount_donated;

        transfer(cpi_context, amount)?; 

        Ok(())
    }


}
