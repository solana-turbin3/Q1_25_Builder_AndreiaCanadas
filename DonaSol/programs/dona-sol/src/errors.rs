use anchor_lang::error_code;

#[error_code]
pub enum DonaSolError {
    #[msg("User is not admin")]
    UserIsNotAdmin,

    #[msg("Refund not available (project milestone completed)")]
    RefundErrorMilestoneCompleted,

    #[msg("Refund not available (reflection period has elapsed)")]
    RefundErrorReflectionPeriod,

    #[msg("Target not reached")]
    TargetNotReached,

    #[msg("Project deadline not reached")]
    DeadlineNotReached,

    #[msg("Signer is not profile owner")]
    SignerIsNotOwner,

    #[msg("Project campaign deadline ended")]
    DeadlineEnded,

    #[msg("Insufficient amount for rent exemption")]
    InsufficientAmount,
    
}