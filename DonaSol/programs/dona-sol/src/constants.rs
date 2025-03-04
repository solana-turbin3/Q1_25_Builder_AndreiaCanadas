use std::fmt;

use anchor_lang::prelude::*;

pub const ANCHOR_DISCRIMINATOR: usize = 8;

// Reflection period of 72h = 72 h * 60 min/h * 60 s/min = 259200 s
pub const REFLECTION_PERIOD: u32 = 259200;

#[derive(Clone, Debug, PartialEq, AnchorSerialize, AnchorDeserialize)]
pub enum VerificationStatus {
    Pending,
    Verified,
    Rejected,
}

impl Space for VerificationStatus {
    const INIT_SPACE: usize = 1;
}

#[derive(Clone, Debug, PartialEq, AnchorSerialize, AnchorDeserialize)]
pub enum ProfileType {
    Education,
    Healthcare,
    Environment,
    PovertyAlleviation,
    AnimalWelfare,
    HumanRights,
    DisasterRelief,
    Culture,
    Other
}

impl Space for ProfileType {
    const INIT_SPACE: usize = 1;
}

#[derive(Clone, Debug, PartialEq, AnchorSerialize, AnchorDeserialize)]
pub enum UserMilestone {
    DonorNewbie,                // Making the first donation
    GenerosityGrasshopper,      // For reaching a total of 100 SOL in donations.
    CharityChampion,            // For reaching a total of 200 SOL in donations. 
    KindnessKnight,             // For reaching a total of 350 SOL in donations.
    GenerosityGuru              // For reaching a total of 500 SOL in donations.
}

impl fmt::Display for UserMilestone {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let description = match self {
            UserMilestone::DonorNewbie => "Donor Newbie",
            UserMilestone::GenerosityGrasshopper => "Generosity Grasshopper",
            UserMilestone::CharityChampion => "Charity Champion",
            UserMilestone::KindnessKnight => "Kindness Knight",
            UserMilestone::GenerosityGuru => "Generosity Guru",
        };
        write!(f, "{}", description)
    }
}