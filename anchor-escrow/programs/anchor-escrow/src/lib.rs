mod state;
use state::*;
mod instructions;
use instructions::*;

use anchor_lang::prelude::*;

declare_id!("eERRudZGiBWhxznLZki9xqZLhPZ9dp13dST9iR3QiZ3");

// entry point do client side
#[program]
pub mod anchor_escrow {
    use super::*;

    pub fn make(ctx: Context<Make>, seed: u64, receive: u64, deposit: u64) -> Result<()> {
        
        ctx.accounts.init_escrow(seed, receive, &ctx.bumps)?;

        ctx.accounts.deposit(deposit)?;

        Ok(())
    }

    pub fn take(ctx: Context<Take>) -> Result<()> {

        ctx.accounts.send()?;

        ctx.accounts.withdraw_and_close()?;

        Ok (())
    }

    pub fn refund(ctx: Context<Refund>) -> Result<()> {
        
        ctx.accounts.refund_and_close_vault()?;

        Ok(())
    }

}

