use anchor_lang::prelude::*;

use crate::{errors::DonaSolError, state::Settings};


#[derive(Accounts)]
pub struct SetSettings<'info> {
    #[account(
        mut,
        //address = user.key,
    )]
    pub user: Signer<'info>,
    #[account(
        seeds = [b"admin"],
        bump,
    )]
    pub settings: Account<'info, Settings>,
}

impl<'info> SetSettings<'info> {
    pub fn set_settings(&mut self, new_admin: Pubkey) -> Result<()> {
        require_eq!(self.user.key(), self.settings.admin, DonaSolError::UserIsNotAdmin);

        self.settings.admin = new_admin;
        Ok(())
    }
}