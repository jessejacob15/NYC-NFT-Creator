const fs = require('fs')
const pinataSDK = require('@pinata/sdk');
require("dotenv").config();

const pinata = pinataSDK(process.env.PINATA_KEY, process.env.PINATA_SECRET_KEY);

async function returnPinataUrl(svgText) {
    filename = ('./MySVG.svg')
    fs.writeFileSync(filename, svgText, (err) => {
        if (err) {
          console.log(err);
        }
    });
    const finalURL = await uploadToPinata(filename)
   // console.log(finalURL)
    return finalURL
}

async function uploadToPinata(filename) {
    let toREturn = ""
    await pinata.testAuthentication().then((result) => {
        //handle successful authentication here
        //console.log(result);
       
    }).catch((err) => {
        //handle error here
        console.log(err);
    });

    const readableStreamForFile = fs.createReadStream(filename);
    const options = {
        pinataMetadata: {
            name: "NYC_NFT_TESTING",
            // keyvalues: {
            //     customKey: 'customValue',
            //     customKey2: 'customValue2'
            // }
        },
        pinataOptions: {
            cidVersion: 0
        }
    };
    await pinata.pinFileToIPFS(readableStreamForFile, options).then((result) => {
        //handle results here
       // console.log(result);
        toREturn = "ipfs://" + result["IpfsHash"]
    }).catch((err) => {
        //handle error here
        console.log(err);
    });

    return toREturn
}

module.exports = async function (svg) { 
    return await returnPinataUrl(svg);
};