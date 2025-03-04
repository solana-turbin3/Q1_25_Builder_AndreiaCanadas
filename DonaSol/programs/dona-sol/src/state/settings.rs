use anchor_lang::prelude::*;

#[account]
pub struct Settings {
    pub admin: Pubkey,
    pub bump: u8,
}

impl Space for Settings {
    const INIT_SPACE: usize = 8 + 32 + 1;
}