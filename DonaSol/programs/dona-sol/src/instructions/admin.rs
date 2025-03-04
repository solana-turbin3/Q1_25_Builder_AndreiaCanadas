use anchor_lang::prelude::*;

use crate::{
    constants::VerificationStatus, 
    errors::DonaSolError, 
    state::{
        Institution, 
        Profile, 
        Settings
    }
};

#[derive(Accounts)]
pub struct Admin<'info> {
    pub user: Signer<'info>,
    pub settings: Account<'info, Settings>,
    pub institution: SystemAccount<'info>,
    #[account(
        mut,
        seeds = [b"institution", institution.key().as_ref()],
        bump = institution_account.bump,
    )]
    pub institution_account: Option<Account<'info, Institution>>,
    #[account(
        seeds = [b"profile", institution.key().as_ref(), profile.name.as_ref()],
        bump = profile.bump,
    )]
    pub profile: Option<Account<'info, Profile>>,
}

impl<'info> Admin<'info> {
    pub fn set_status_institution(&mut self, status: VerificationStatus) -> Result<()> {

        require!(
            self.user.key() == self.settings.admin && self.institution_account.as_ref().is_some(),
            DonaSolError::UserIsNotAdmin
        );

        if let Some(institution) = self.institution_account.as_mut() {
            institution.verification_status = status;
        }

        Ok(())
    }

    pub fn set_status_profile(&mut self, status: VerificationStatus) -> Result<()> {
        require!(
            self.user.key() == self.settings.admin && self.profile.is_some(),
            DonaSolError::UserIsNotAdmin
        );

        if let Some(profile) = self.profile.as_mut() {
            profile.verification_status = status;
        }

        Ok(())
    }
    
}

