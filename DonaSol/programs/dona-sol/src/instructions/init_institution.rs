use anchor_lang::prelude::*;

use crate::{
    constants::VerificationStatus, 
    state::Institution
};

#[derive(Accounts)]
#[instruction(name: String, website: String)]
pub struct InitInstitution<'info> {
    #[account(mut)]
    pub institution: Signer<'info>,
    #[account(
        init,
        payer = institution,
        seeds = [b"institution", institution.key().as_ref()],
        bump,
        space = Institution::INIT_SPACE + name.len() + website.len(),
    )]
    pub institution_account: Account<'info, Institution>,
    pub system_program: Program<'info, System>,
}

impl<'info> InitInstitution<'info> {
    pub fn init_institution(&mut self, name: String, website: String, bumps: InitInstitutionBumps) -> Result<()> {
        self.institution_account.set_inner(Institution { 
            owner: self.institution.key(), 
            verification_status: VerificationStatus::Pending, 
            registration_date: Clock::get()?.unix_timestamp, 
            bump: bumps.institution_account, 
            name, 
            website, 
        });

        Ok(())
    }
    
}