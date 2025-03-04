use anchor_lang::prelude::*;

declare_id!("GznbGRXZGfVAB6tzeFeYGvwMrQ2T49rgBjLk6A3STmzp");

mod state;
mod instructions;
mod errors;
mod constants;

use instructions::*;
use constants::*;

#[program]
pub mod dona_sol {

    use super::*;

    pub fn init_settings(ctx: Context<InitSettings>) -> Result<()> {
        ctx.accounts.initialize(ctx.bumps)?;

        Ok(())
    }

    pub fn set_settings(ctx: Context<SetSettings>, new_admin: Pubkey) -> Result<()> {
        ctx.accounts.set_settings(new_admin)?;

        Ok(())
    }

    pub fn init_institution(ctx: Context<InitInstitution>, name: String, website: String) -> Result<()> {
        ctx.accounts.init_institution(name, website, ctx.bumps)?;

        Ok(())
    }

    pub fn init_profile(ctx: Context<InitProfile>, name: String, target: u64, duration: u16, category: ProfileType, description: String) -> Result<()> {
        ctx.accounts.init_profile(name, target, duration, category, description, ctx.bumps, false)?;

        Ok(())
    }

    pub fn set_status_institution(ctx: Context<Admin>, status: VerificationStatus) -> Result<()> {
        ctx.accounts.set_status_institution(status)?;

        Ok(())
    }

    pub fn set_status_profile(ctx: Context<Admin>, status: VerificationStatus) -> Result<()> {
        ctx.accounts.set_status_profile(status)?;

        Ok(())
    }

    pub fn init_user(ctx: Context<InitUser>, profile_name: String, user_name: String) -> Result<()> {
        ctx.accounts.init_user_account(profile_name, ctx.bumps)?;
        ctx.accounts.mint_profile_nft(user_name)?;

        Ok(())
    }

    pub fn donate(ctx: Context<Donate>, amount: u64) -> Result<()> {
        ctx.accounts.donate(amount)?;

        Ok(())
    }

    pub fn refund(ctx: Context<Refund>, profile_name: String) -> Result<()> {
        ctx.accounts.refund_donor(profile_name)?;

        Ok(())
    }

    pub fn transfer_to_institution(ctx: Context<WithdrawFunds>, profile_name: String) -> Result<()> {
        ctx.accounts.transfer_to_institution(profile_name)?;

        Ok(())
    }

    // Method used for testing purposes. To be deleted in production
    pub fn set_duration(ctx: Context<WithdrawFunds>, profile_name: String, new_duration: u16) -> Result<()> {
        ctx.accounts.set_duration(profile_name, new_duration)?;

        Ok(())
    }

}

