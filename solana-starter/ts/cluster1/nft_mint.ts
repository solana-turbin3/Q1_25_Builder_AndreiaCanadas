import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity, generateSigner, percentAmount } from "@metaplex-foundation/umi"
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";

import wallet from "../../Turbin3-wallet.json"
import base58 from "bs58";

const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata())

const mint = generateSigner(umi);

// uri metadata -> generated at nft_metadata:
const uri_metadata = [
    "https://devnet.irys.xyz/2NoVARDpZnroHwyJ58JtpZtMhJFuEngD3wmeVSeoSSn7", //Ruglicious
    "https://devnet.irys.xyz/FbFB3ezeszXvJunE3axJ7wF7qXS2XYyPizwvHTvCCguh", //Fiona&Mia
    "https://devnet.irys.xyz/AeBeG72tZqdkq1gRR8xC864adkTTmvcmPoQ7mJKWERPp", //CarCrash
    "https://devnet.irys.xyz/83L5FTf97hq6mdPgtBG2SJHn1c63CzxM9tQwpJjdwLFm", //Peacock
];

(async () => {
    let tx = createNft(umi, {
        mint: mint,
        name: "Ruglicious",
        symbol: "AC",
        uri: uri_metadata[0],
        sellerFeeBasisPoints: percentAmount(10),
    });
    let result = await tx.sendAndConfirm(umi);
    const signature = base58.encode(result.signature);
    
    console.log(`Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`)

    console.log("Mint Address: ", mint.publicKey);
})();