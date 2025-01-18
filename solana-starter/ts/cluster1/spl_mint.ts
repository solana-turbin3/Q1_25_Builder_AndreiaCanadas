import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import wallet from "../../Turbin3-wallet.json"
import { connect } from "http2";

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 1_000_000n;

// Mint address -> generated at spl_init.ts
const mint = new PublicKey("7wntb6WE52HHVu5fXdVwdTJdjTUod9Y6fL6fgAVwgy8a");

(async () => {
    try {
        // Create an ATA
        const ata = await getOrCreateAssociatedTokenAccount(connection, keypair, mint, keypair.publicKey);
        console.log(`Your ata is: ${ata.address.toBase58()}`);

        // Mint to ATA
        const mintTx = await mintTo(connection, keypair, mint, ata.address, keypair.publicKey, token_decimals);
        console.log(`Your mint txid: ${mintTx}`);
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }

    //Console output:
    //Your ata is: J86shKFqvnK8D6CcEA55rZWub8wwHpEY47vP4TCcg5ir
    //Your mint txid: 5FWQPpFrUJjjT6g1ixwq5ZqYEGovw8QAqCDzDXanogwnSr54Ha15WFvrjKuzo8AGth27aMsRyrkiuCuUiMpQmRRD
})()
