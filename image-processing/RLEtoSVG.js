const fs = require('fs')
const { ethers } = require("ethers");
const pinataSDK = require('@pinata/sdk');
require("dotenv").config({ path: "../.env" });
const path = require('path');


const pinata = pinataSDK(process.env.PINATA_KEY, process.env.PINATA_SECRET_KEY);


async function writeSVG(seed) {
    const header = '<svg width="780" height="1040" viewbox ="0,0,780,1040" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">\n<rect width = "780" height = "1040" fill = "#000000"/>'
    const filename = path.normalize(__dirname + "/SVG-files/imageSVG.svg")
    fs.appendFileSync(filename, header, (err) => {
        if (err) {
            console.log(err);
        }
    });
    createRects(seed.skin, seed.skinPalette, filename)
    // createRects(seed.jacket, seed.jacketPalette, filename)
    //   createRects(seed.head, seed.headPalette, filename)
    fs.appendFileSync(filename, "</svg>", (err) => {
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

function createRects(component, componentPalette, filename) {
    let yStart = ethers.BigNumber.from(component[0]).toNumber()
    let xStart = ethers.BigNumber.from(component[3]).toNumber()
    let xEnd = ethers.BigNumber.from(component[1]).toNumber()
    let totalWidth = xEnd - xStart  //480 24 wide    
    let totalWidthBlocks = totalWidth / 20
    totalWidthBlocks = Math.ceil(totalWidthBlocks)
    let currBlockCount = 0
    let currX = xStart
    let currY = yStart
    for (let i = 4; i < component["length"] - 2; i += 2) {
        let length = ethers.BigNumber.from(component[i]).toNumber()
        let color = componentPalette[component[i + 1]]
        let testX = currBlockCount + length

        if (testX <= totalWidthBlocks) {
            const line = '<rect width="' + (20 * length) + '" height= "' + (20) + '" x="' + (currX) + '" y="' + (currY) + '" fill="' + color + '"/>\n'
            currX += length * 20
            currBlockCount += length
            fs.appendFileSync(filename, line, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
        else {
            currY += 20
            currX = xStart
            const line = '\n\n<rect width="' + (20 * length) + '" height= "' + (20) + '" x="' + (currX) + '" y="' + (currY) + '" fill="' + color + '"/>\n'
            currX += length * 20
            currBlockCount = length;
            fs.appendFileSync(filename, line, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
    }
}


module.exports = async function (seed) {
    return await writeSVG(seed);
};