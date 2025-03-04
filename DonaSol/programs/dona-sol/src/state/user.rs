use anchor_lang::prelude::*;

#[account]
pub struct User {
    pub owner: Pubkey,           // user (donor)
    pub profile: Pubkey,         // profile donating to
    pub amount_donated: u64,     // amount donated to the profile
    pub last_donation_date: i64, // timestamp of last donation
    pub bump: u8,                // bump
}

impl Space for User {
    const INIT_SPACE: usize = 8 + 32 + 32 + 8 + 8 + 1;
}