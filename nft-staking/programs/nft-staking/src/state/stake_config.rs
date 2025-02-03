use anchor_lang::prelude::*;

#[account]
pub struct StakeConfig {
    pub points_per_stake: u8,   // points per day
    pub max_stake: u8,          // max amount NFT to stake
    pub freeze_period: u32,     // days
    pub rewards_bump: u8,
    pub bump: u8,
}

impl Space for StakeConfig {
    const INIT_SPACE: usize = 8 + 1 + 1 + 4 + 1 + 1;
}