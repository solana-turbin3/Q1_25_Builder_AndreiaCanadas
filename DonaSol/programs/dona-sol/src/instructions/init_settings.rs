use anchor_lang::prelude::*;

use crate::state::Settings;


#[derive(Accounts)]
pub struct InitSettings<'info> {
    #[account(
        mut,
        //address = user.key,
    )]
    pub user: Signer<'info>,
    #[account(
        init,
        payer = user,
        seeds = [b"admin"],
        bump,
        space = Settings::INIT_SPACE,
    )]
    pub settings: Account<'info, Settings>,
    pub system_program: Program<'info, System>,
}

impl<'info> InitSettings<'info> {
    pub fn initialize(&mut self, bumps: InitSettingsBumps) -> Result<()> {
        self.settings.set_inner(Settings { 
            admin: self.user.key(), 
            bump: bumps.settings,
        });
        
        Ok(())
    }
}