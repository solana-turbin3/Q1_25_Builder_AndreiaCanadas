import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../../Turbin3-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("7wntb6WE52HHVu5fXdVwdTJdjTUod9Y6fL6fgAVwgy8a");

// Recipient address -> Used Discord @ Mfoniso:
const to = new PublicKey("2WKb1EQDfEKbivtmYHjx2cErQjASaNizVUC1AW2nbHKR");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const fromWallet = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey
        );

        // Get the token account of the toWallet address, and if it does not exist, create it
        const toWallet = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            to
        );

        // Transfer the new token to the "toTokenAccount" we just created
        const signature = await transfer(
            connection, 
            keypair, 
            fromWallet.address,
            toWallet.address,
            keypair,
            100
        );

    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();