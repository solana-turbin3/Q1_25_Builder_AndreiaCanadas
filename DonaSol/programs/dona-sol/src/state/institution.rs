use anchor_lang::prelude::*;

use crate::constants::VerificationStatus;

#[account]
pub struct Institution {
    pub owner: Pubkey,
    pub verification_status: VerificationStatus,    // verification status: updated by platform admin
    pub registration_date: i64,                     // timestamp for resgistration
    pub bump: u8,                    
    pub name: String,                               // institution name
    pub website: String,                            // webpage URL
}

impl Space for Institution {    // String size to be added at init
    const INIT_SPACE: usize = 8 + 32 + 1 + 8 + 1 + 4 + 4;    
}