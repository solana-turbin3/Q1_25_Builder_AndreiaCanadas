import wallet from "../../Turbin3-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// image URI list -> generated at nft_image.ts
const image_list = ["https://devnet.irys.xyz/DGrpB6der9SPFkFKQd1X4XCb7ReXHfhh5qXYoT5pCy1i", //rug
    "https://devnet.irys.xyz/DPCy8yFHBkPvD2xEe7Rp1TNFf8BudTY7q9qhTMEg3Rds",                 //fiona
    "https://devnet.irys.xyz/E3zbhMQa9BTtCk5sbinzhkcuuXggT29HXfgC9qvDbhJs",                 //car
    "https://devnet.irys.xyz/Cmu15qvEHBtGmqcnE42VU7fFGgozzJSaKGFu7BEre3ks"];                //peacock

// metadata options for the input images previously generated:
const metadata_list = [ 
    {   // Rug
        name: "Ruglicious",
        symbol: "RUG",
        description: "Just a regular everyday normal rug",
        image: image_list[0],
        attributes: [
            {trait_type: 'Rarity', value: 'Boring Common'},
            {trait_type: 'Color', value: 'Pinkish'} ],
        properties: { files: [ {type: "image/png", uri: image_list[0] } ] },
        creators: []
    },
    {   // Fiona & Mia
        name: "Fiona&Mia",
        symbol: "MF",
        description: "Some fucking adorable cats",
        image: image_list[1],
        attributes: [
            {trait_type: 'Rarity', value: 'unique'},
            {trait_type: 'Color', value: 'Black & Red-haired Black'},
            {trait_type: 'Personality', value: 'Soooo cute'} ],
        properties: { files: [ {type: "image/png", uri: image_list[1] } ] },
        creators: []
    },
    {   // Car
        name: "CarCrash",
        symbol: "F***",
        description: "A fucking disaster",
        image: image_list[2],
        attributes: [
            {trait_type: 'Rarity', value: 'Hope to be once in a lifetime'},
            {trait_type: 'Cars', value: 'Fiat'},
            {trait_type: 'Highlight', value: '3 wheels in the air'} ],
        properties: { files: [ {type: "image/png", uri: image_list[2] } ] },
        creators: []
    },
    {   // Peacock
        name: "Peacock",
        symbol: "AC",
        description: "A beautiful peacock just hanging around",
        image: image_list[3],
        attributes: [
            {trait_type: 'Rarity', value: 'legendary'},
            {trait_type: 'Fuel', value: 'Powered by Monster'},
            {trait_type: 'Special Attack', value: 'Pewwww'} ],
        properties: { files: [ {type: "image/png", uri: image_list[3] } ] },
        creators: []
    },
]

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const metadata = metadata_list[3];
        const myUri = await umi.uploader.uploadJson(metadata);
        console.log("Your metadata URI: ", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
