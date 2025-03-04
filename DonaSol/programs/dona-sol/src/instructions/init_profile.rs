use anchor_lang::prelude::*;
//use anchor_spl::token::TokenAccount;

use crate::{
    constants::{
        ProfileType, 
        VerificationStatus, 
        ANCHOR_DISCRIMINATOR
    }, 
    state::{
        Institution, Profile, VaultState
    }
};

#[derive(Accounts)]
#[instruction(name: String)]
pub struct InitProfile<'info> {
    #[account(mut)]
    pub institution: Signer<'info>,
    #[account(
        seeds = [b"institution", institution.key().as_ref()],
        bump = institution_account.bump,
        constraint = institution_account.verification_status == VerificationStatus::Verified,
    )]
    pub institution_account: Account<'info, Institution>,
    #[account(
        init,
        payer = institution,
        seeds = [b"profile", institution.key().as_ref(), name.as_bytes()],
        bump,
        space = ANCHOR_DISCRIMINATOR + Profile::INIT_SPACE,
    )]
    pub profile: Account<'info, Profile>,
    
    #[account(
        init,
        payer = institution,
        seeds = [b"state", profile.key().as_ref()],
        bump,
        space = VaultState::INIT_SPACE,
    )]
    pub vault_state: Account<'info, VaultState>,
    #[account(
        mut,
        seeds = [b"vault", vault_state.key().as_ref()],
        bump,
    )]
    pub vault: SystemAccount<'info>, // Add option
    //pub vault_spl: Option<Account<'info, TokenAccount>>,

    pub system_program: Program<'info, System>,
}

impl<'info> InitProfile<'info> {
    pub fn init_profile(&mut self, name: String, target: u64, duration: u16, category: ProfileType, description: String, bumps: InitProfileBumps, _is_sol: bool) -> Result<()> {

        //TBD: To implement receive SOL or USDC
        // match is_sol {
        //     true => {
        //         require!(self.vault.is_some(), DeadlineNotReached);
        //         }
        //     false => {
        //         require!(self.vault_spl.is_some(), ANCHOR_DISCRIMINATOR);
        //         }
        //     }

        self.profile.set_inner(Profile { 
            owner: self.institution.key(), 
            target, 
            start_date: Clock::get()?.unix_timestamp, 
            duration, 
            verification_status: VerificationStatus::Pending,
            bump: bumps.profile,
            category,
            name, 
            description,
            donations_list: Vec::new(),
        });
        self.vault_state.set_inner(VaultState {
            vault_bump: bumps.vault,
            state_bump: bumps.vault_state,
        });
        Ok(())
    }

}