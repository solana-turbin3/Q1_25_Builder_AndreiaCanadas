mod state;
use state::*;
mod instructions;
use instructions::*;

use anchor_lang::prelude::*;

declare_id!("eERRudZGiBWhxznLZki9xqZLhPZ9dp13dST9iR3QiZ3");

//mod instructions;

#[program]
pub mod anchor_escrow {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {

}
