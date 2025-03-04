import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { DonaSol } from "../target/types/dona_sol";

import { SYSTEM_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/native/system";
import { Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { MPL_CORE_PROGRAM_ID } from "@metaplex-foundation/mpl-core";

//import wallet from "../Turbin3-wallet.json"


describe("dona-sol", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.DonaSol as Program<DonaSol>;

  // Generate keypairs
  const admin = anchor.web3.Keypair.generate();
  const Paws4Paws = anchor.web3.Keypair.generate();
  const HouseForAll = anchor.web3.Keypair.generate();
  const DonaTech = anchor.web3.Keypair.generate();
  const CommunityDon = anchor.web3.Keypair.generate();
  const assetDonaTech = Keypair.generate();
  const assetCommunityDon = Keypair.generate();


  // Profile info
  const profilePaws4PawsName = "Animal Shelter";
  const profilePineapplePawsName = "Paws on Pinapple";
  const profileHouseRepairName = "House Repair";

  // PDAs
  const adminAccount = anchor.web3.PublicKey.findProgramAddressSync([Buffer.from("admin")], program.programId)[0];
  const institutionAccountPaws = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("institution"), Paws4Paws.publicKey.toBuffer()], 
    program.programId)
    [0];
  const profilePaws4Paws = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("profile"), Paws4Paws.publicKey.toBuffer(), Buffer.from(profilePaws4PawsName)], 
    program.programId)
    [0];
  const vaultStatePaws4Paws = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("state"), profilePaws4Paws.toBuffer()], 
    program.programId)
    [0];
  const vaultPaws4Paws = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), vaultStatePaws4Paws.toBuffer()], 
    program.programId)
    [0];

  const profilePineapplePaws = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("profile"), Paws4Paws.publicKey.toBuffer(), Buffer.from(profilePineapplePawsName)], 
    program.programId)
    [0];
  const vaultStatePinapplePaws = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("state"), profilePineapplePaws.toBuffer()], 
    program.programId)
    [0];
  const vaultPinapplePaws = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), vaultStatePinapplePaws.toBuffer()], 
    program.programId)
    [0];

  const institutionAccountHouse = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("institution"), HouseForAll.publicKey.toBuffer()], 
    program.programId)
    [0];
  const profileHouseRepair = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("profile"), HouseForAll.publicKey.toBuffer(), Buffer.from(profileHouseRepairName)], 
    program.programId)
    [0];
  const vaultStateHouseRepair = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("state"), profileHouseRepair.toBuffer()], 
    program.programId)
    [0];
  const vaultHouseRepair = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("vault"), vaultStateHouseRepair.toBuffer()], 
    program.programId)
    [0];
  const userDonaTech = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("donor"), DonaTech.publicKey.toBuffer(), Buffer.from(profilePaws4PawsName)], 
    program.programId)
    [0];
  const userDonaTechPineapple = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("donor"), DonaTech.publicKey.toBuffer(), Buffer.from(profilePineapplePawsName)], 
    program.programId)
    [0];
  const userCommunityDon = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("donor"), CommunityDon.publicKey.toBuffer(), Buffer.from(profileHouseRepairName)], 
    program.programId)
    [0];

  before('Test setup: Aidrop SOL', async () => {
    const tx = await provider.connection.requestAirdrop(admin.publicKey, 2 * LAMPORTS_PER_SOL);
    await provider.connection.confirmTransaction(tx);
    console.log("Admin balance: ", await provider.connection.getBalance(admin.publicKey));
    const tx1 = await provider.connection.requestAirdrop(Paws4Paws.publicKey, 2 * LAMPORTS_PER_SOL);
    await provider.connection.confirmTransaction(tx1);
    console.log("Institution Paws4Paws balance: ", await provider.connection.getBalance(Paws4Paws.publicKey));
    const tx2 = await provider.connection.requestAirdrop(HouseForAll.publicKey, 2 * LAMPORTS_PER_SOL);
    await provider.connection.confirmTransaction(tx2);
    console.log("Institution HouseForAll balance: ", await provider.connection.getBalance(HouseForAll.publicKey));
    const tx3 = await provider.connection.requestAirdrop(DonaTech.publicKey, 20 * LAMPORTS_PER_SOL);
    await provider.connection.confirmTransaction(tx3);
    console.log("User DonaTech balance: ", await provider.connection.getBalance(DonaTech.publicKey));
    const tx4 = await provider.connection.requestAirdrop(CommunityDon.publicKey, 2 * LAMPORTS_PER_SOL);
    await provider.connection.confirmTransaction(tx4);
    console.log("User CommunityDon balance: ", await provider.connection.getBalance(CommunityDon.publicKey));
  });

  it("Create Settings / Admin Account", async () => {
    // Add your test here.
    try {
      await program.account.settings.fetch(adminAccount);
      console.log("\nSettings account already created");
    } catch (error) {
      const tx = await program.methods.initSettings()
      .accountsPartial({
        user: admin.publicKey,
        settings: adminAccount,
        systemProgram: SYSTEM_PROGRAM_ID,
      })
      .signers([admin])
      .rpc();
      console.log("\nSettings account created");
      const settings = await program.account.settings.fetch(adminAccount);
      console.log("\nUser: ", admin.publicKey.toBase58())
      console.log("Settings account Admin: ", settings.admin.toBase58());
      console.log("\nYour transaction signature: ", tx);
    }
  });

  it("Create a new Institution (Paws4Paws)", async () => {
    // Add your test here.
    const tx = await program.methods.
    initInstitution("Paws4Paws", "https://paws4paws.com")
    .accountsPartial({
      institution: Paws4Paws.publicKey,
      institutionAccount: institutionAccountPaws,
      systemProgram: SYSTEM_PROGRAM_ID,
    })
    .signers([Paws4Paws])
    .rpc();

    console.log("\nInstitution Paws4Paws account created");
    const institutionAccount = await program.account.institution.fetch(institutionAccountPaws);
    console.log("\nInstitution account: ", institutionAccount.owner.toBase58());
    console.log("\nYour transaction signature: ", tx);
  });

  it(`Attempt to create Profile by unverified Institution`, async () => {
    // Add your test here.
    const target = new anchor.BN(2 * LAMPORTS_PER_SOL);
    const duration = 65530;
    const type = { animalWelfare: {}};
    const description = "Paws4Paws is raising funds to build a new shelter for stray animals.";
    try {
      const tx = await program.methods.
      initProfile(profilePaws4PawsName, target, duration, type, description)
      .accountsPartial({
      institution: Paws4Paws.publicKey,
      institutionAccount: institutionAccountPaws,
      profile: profilePaws4Paws,
      systemProgram: SYSTEM_PROGRAM_ID,
      vaultState: vaultStatePaws4Paws,
      vault: vaultPaws4Paws,
      })
      .signers([Paws4Paws])
      .rpc();
    } catch (error) {
      console.log("\nProfile creation failed as expected.");
    }
  });

  it("Verify Institution Paws4Paws", async () => { 
    const tx = await program.methods.
    setStatusInstitution( {verified: {} })
    .accountsPartial({
      user: admin.publicKey,
      settings: adminAccount,
      institution: Paws4Paws.publicKey,
      institutionAccount: institutionAccountPaws,
      profile: null,
    })
    .signers([admin])
    .rpc({
      skipPreflight: true,
    });

    console.log("\nInstitution Paws4Paws account verified by admin");
    const institutionAccount = await program.account.institution.fetch(institutionAccountPaws);
    console.log("\nInstitution account: ", institutionAccount.owner.toBase58());
    console.log("\nYour transaction signature: ", tx);
  });

  it(`Create a Profile for Paws4Paws:  ${profilePaws4PawsName}`, async () => {
    // Add your test here.
    const target = new anchor.BN(2 * LAMPORTS_PER_SOL);
    const duration = 65530;
    const type = { animalWelfare: {}};
    const description = "Paws4Paws is raising funds to build a new shelter for stray animals.";
    const tx = await program.methods.
    initProfile(profilePaws4PawsName, target, duration, type, description)
    .accountsPartial({
      institution: Paws4Paws.publicKey,
      institutionAccount: institutionAccountPaws,
      profile: profilePaws4Paws,
      systemProgram: SYSTEM_PROGRAM_ID,
      vaultState: vaultStatePaws4Paws,
      vault: vaultPaws4Paws,
    })
    .signers([Paws4Paws])
    .rpc();

    console.log(`\nProfile created: ${profilePaws4PawsName}`);
    const profile = await program.account.profile.fetch(profilePaws4Paws);
    console.log("\nProfile account owner: ", profile.owner.toBase58());
    console.log("\nYour transaction signature: ", tx);
  });

it(`Create a second Profile for Paws4Paws: ${profilePineapplePawsName}`, async () => {
    // Add your test here.
    const target = new anchor.BN(500 * LAMPORTS_PER_SOL);
    const duration = 30;
    const type = { animalWelfare: {}};
    const description = "Project to raise funds for cirurgical procedures on stray animals.";
    const tx = await program.methods.
    initProfile(profilePineapplePawsName, target, duration, type, description)
    .accountsPartial({
      institution: Paws4Paws.publicKey,
      institutionAccount: institutionAccountPaws,
      profile: profilePineapplePaws,
      systemProgram: SYSTEM_PROGRAM_ID,
      vaultState: vaultStatePinapplePaws,
      vault: vaultPinapplePaws,
    })
    .signers([Paws4Paws])
    .rpc();

    console.log(`\nProfile created: ${profilePineapplePawsName}`);
    const profile = await program.account.profile.fetch(profilePineapplePaws);
    console.log("\nProfile account owner: ", profile.owner.toBase58());
    console.log("\nYour transaction signature: ", tx);
  });

  it("Create a new Institution (HouseForAll)", async () => {
    // Add your test here.
    const tx = await program.methods.
    initInstitution("HouseForAll", "https://houseforall.com")
    .accountsPartial({
      institution: HouseForAll.publicKey,
      institutionAccount: institutionAccountHouse,
      systemProgram: SYSTEM_PROGRAM_ID,
    })
    .signers([HouseForAll])
    .rpc();

    console.log("\nInstitution HouseForAll account created");
    const institutionAccount = await program.account.institution.fetch(institutionAccountHouse);
    console.log("\nInstitution account: ", institutionAccount.owner.toBase58());
    console.log("\nYour transaction signature: ", tx);
  });

  it("Verify Institution HouseForAll", async () => { 
    const tx = await program.methods.
    setStatusInstitution( {verified: {} })
    .accountsPartial({
      user: admin.publicKey,
      settings: adminAccount,
      institution: HouseForAll.publicKey,
      institutionAccount: institutionAccountHouse,
      profile: null,
    })
    .signers([admin])
    .rpc({
      skipPreflight: true,
    });

    console.log("\nInstitution HouseForAll account verified by admin");
    const institutionAccount = await program.account.institution.fetch(institutionAccountHouse);
    console.log("\nInstitution account: ", institutionAccount.owner.toBase58());
    console.log("\nYour transaction signature: ", tx);
  });

  it(`Create a Profile for ${profileHouseRepairName}`, async () => {
    // Add your test here.
    const target = new anchor.BN(10000 * LAMPORTS_PER_SOL);
    const duration = 60;
    const type = { povertyAlleviation: {} };
    const description = "HouseForAll is raising funds to improve family “Jolie” house (roof repair and bathroom renovation).";
    const tx = await program.methods.
    initProfile(profileHouseRepairName, target, duration, type, description)
    .accountsPartial({
      institution: HouseForAll.publicKey,
      institutionAccount: institutionAccountHouse,
      profile: profileHouseRepair,
      systemProgram: SYSTEM_PROGRAM_ID,
      vaultState: vaultStateHouseRepair,
      vault: vaultHouseRepair,
    })
    .signers([HouseForAll])
    .rpc();

    console.log(`\nProfile created: ${profileHouseRepairName}`);
    const profile = await program.account.profile.fetch(profileHouseRepair);
    console.log("\nProfile account owner: ", profile.owner.toBase58());
    console.log("\nYour transaction signature: ", tx);
  });

  
  it("Verify Profile profilePaws4Paws", async () => { 
    const tx = await program.methods
    .setStatusProfile( {verified: {} })
    .accountsPartial({
      user: admin.publicKey,
      settings: adminAccount,
      institution: Paws4Paws.publicKey,
      institutionAccount: null,
      profile: profilePaws4Paws,
    })
    .signers([admin])
    .rpc();

    console.log("\Profile profilePaws4Paws verified by admin");
    const profileAccount = await program.account.profile.fetch(profilePaws4Paws);
    console.log("\Profile account: ", profileAccount.owner.toBase58());
    console.log("\nYour transaction signature: ", tx);
  });

  it("User DonaTech account created", async () => {
    // Add your test here.
    const userName = "DonaTech";
    const profileName = profilePaws4PawsName;
    const tx = await program.methods.
    initUser(profileName, userName)
    .accountsPartial({
      user: DonaTech.publicKey,
      userAccount: userDonaTech,
      profile: profilePaws4Paws,
      mint: assetDonaTech.publicKey,
      systemProgram: SYSTEM_PROGRAM_ID,
      mplCoreProgram: MPL_CORE_PROGRAM_ID,
    })
    .signers([DonaTech, assetDonaTech])
    .rpc();

    console.log("\nUser account for DonaTech created");
    const userAccount = await program.account.user.fetch(userDonaTech);
    console.log("\nUser account: ", userAccount.owner.toBase58());
    console.log("\nYour transaction signature: ", tx);
  });

  it("DonaTech donates to Paws 4 Paws", async () => {
    const userProfile = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("donor"), DonaTech.publicKey.toBuffer(), profilePaws4Paws.toBuffer()], 
      program.programId)[0];
    const amount = new anchor.BN(2 * LAMPORTS_PER_SOL);
    const tx = await program.methods
    .donate(amount)
    .accountsPartial({
      donor: DonaTech.publicKey,
      admin: admin.publicKey,
      profile: profilePaws4Paws,
      userAccount: userProfile,
      vaultState: vaultStatePaws4Paws,
      vault: vaultPaws4Paws,
      coreNftAccount: assetDonaTech.publicKey,
      mplCoreProgram: MPL_CORE_PROGRAM_ID,
    })
    .signers([DonaTech])
    .rpc();

    console.log("\nDonation made by DonaTech");
    const userAccount = await program.account.user.fetch(userDonaTech);
    console.log("\nUser account: ", userAccount.owner.toBase58());
    console.log("\nYour transaction signature: ", tx);
  });

  it("User CommunityDon account created", async () => {
    // Add your test here.
    const userName = "CommunityDon";
    const profileName = profileHouseRepairName;
    const tx = await program.methods.
    initUser(profileName, userName)
    .accountsPartial({
      user: CommunityDon.publicKey,
      userAccount: userCommunityDon,
      profile: profileHouseRepair,
      mint: assetCommunityDon.publicKey,
      systemProgram: SYSTEM_PROGRAM_ID,
      mplCoreProgram: MPL_CORE_PROGRAM_ID,
    })
    .signers([CommunityDon, assetCommunityDon])
    .rpc();

    console.log("\nUser account for CommunityDon created");
    const userAccount = await program.account.user.fetch(userCommunityDon);
    console.log("\nUser account: ", userAccount.owner.toBase58());
    console.log("\nYour transaction signature: ", tx);
  });

  it("CommunityDon donates to HouseForAll", async () => {
    const userProfile = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("donor"), CommunityDon.publicKey.toBuffer(), profileHouseRepair.toBuffer()], 
      program.programId)[0];
    const amount = new anchor.BN(1 * LAMPORTS_PER_SOL);
    const tx = await program.methods
    .donate(amount)
    .accountsPartial({
      donor: CommunityDon.publicKey,
      admin: admin.publicKey,
      profile: profileHouseRepair,
      userAccount: userProfile,
      vaultState: vaultStateHouseRepair,
      vault: vaultHouseRepair,
      coreNftAccount: assetCommunityDon.publicKey,
      mplCoreProgram: MPL_CORE_PROGRAM_ID,
    })
    .signers([CommunityDon])
    .rpc();

    console.log("\nDonation made by CommunityDon");
    const userAccount = await program.account.user.fetch(userCommunityDon);
    console.log("\nUser account: ", userAccount.owner.toBase58());
    console.log("\nYour transaction signature: ", tx);
  });

  it("Paws 4 Paws try to withdraw prior to deadline", async () => {
    try {
      const tx = await program.methods
        .transferToInstitution(profilePaws4PawsName)
        .accountsPartial({
          institution: Paws4Paws.publicKey,
          institutionAccount: institutionAccountPaws,
          profile: profilePaws4Paws,
          vaultState: vaultStatePaws4Paws,
          vault: vaultPaws4Paws,
        })
        .signers([Paws4Paws])
        .rpc();
    } catch (error) {
      console.log("\nWithdrawal attempt failed as expected");
    }
  });

  it("Paws 4 Paws withdraws funds", async () => {
    
    // Update profile duration for testing purposes only
    await program.methods
    .setDuration(profilePaws4PawsName, 0)
    .accountsPartial({
      institution: Paws4Paws.publicKey,
      institutionAccount: institutionAccountPaws,
      profile: profilePaws4Paws,
      vaultState: vaultStatePaws4Paws,
      vault: vaultPaws4Paws,
    })
    .signers([Paws4Paws])
    .rpc();

    const tx = await program.methods
    .transferToInstitution(profilePaws4PawsName)
    .accountsPartial({
      institution: Paws4Paws.publicKey,
      institutionAccount: institutionAccountPaws,
      profile: profilePaws4Paws,
      vaultState: vaultStatePaws4Paws,
      vault: vaultPaws4Paws,
    })
    .signers([Paws4Paws])
    .rpc();

    console.log("\nWithdrawal made by Paws4Paws");
    const institutionAccount = await program.account.institution.fetch(institutionAccountPaws);
    console.log("\nInstitution account: ", institutionAccount.owner.toBase58());
    console.log("\nYour transaction signature: ", tx);
  });


  it("Refund", async () => {
    const tx = await program.methods
    .refund(profileHouseRepairName)
    .accountsPartial({
      donor: CommunityDon.publicKey,
      profile: profileHouseRepair,
      userAccount: userCommunityDon,
      vaultState: vaultStateHouseRepair,
      vault: vaultHouseRepair,
    })
    .signers([CommunityDon])
    .rpc({
      skipPreflight: true,
    });

    console.log("\nRefund made by CommunityDon");
    console.log("\nYour transaction signature: ", tx);
  });

});
