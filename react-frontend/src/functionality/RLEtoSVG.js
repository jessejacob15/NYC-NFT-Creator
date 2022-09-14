import { ethers } from "ethers";
require('dotenv').config()

async function writeSVG(seed) {
    const header = '<svg width="780" height="1040" viewbox ="0,0,780,1040" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">\n<rect width = "780" height = "1040" fill = "#000000"/>'
    const filename = "./imageSVG.svg"
    //const filename = path.normalize(__dirname + "/svgText.svg")
    let finalURL = ""
    let svgTxt = ""
    svgTxt += header

    svgTxt += await createRects(seed.skin, seed.skinPalette, filename)
    svgTxt += await createRects(seed.jacket, seed.jacketPalette, filename)
    svgTxt += await createRects(seed.head, seed.headPalette, filename)
    svgTxt += "</svg>"

    const data = {
        "data" : svgTxt
    }
    await fetch("http://localhost:3001/handle", {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: (JSON.stringify(data))
    }).then(res => res.json()).then(json => finalURL = json.pinata)
    return finalURL
}

async function createRects(component, componentPalette, filename) {
    let svgTxt = ""
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
         let length =  ethers.BigNumber.from(component[i]).toNumber()
         let color = componentPalette[component[i + 1]]
         let testX = currBlockCount + length

        if (testX <= totalWidthBlocks) {
            const line = '<rect width="'+ (20 * length)+'" height= "' + (20) +'" x="' + (currX)+ '" y="'+ (currY)+ '" fill="'+ color +'"/>\n'
            currX += length * 20
            currBlockCount += length

            svgTxt += line
        }
        else {
            currY += 20
            currX = xStart
            const line = '\n\n<rect width="'+ (20* length)+'" height= "' + (20) +'" x="' + (currX)+ '" y="'+ (currY)+ '" fill="'+ color +'"/>\n'
            currX += length * 20
            currBlockCount = length ;

            svgTxt += line
        }
    }
    return svgTxt
}


// eslint-disable-next-line import/no-anonymous-default-export
export default async function (seed) { 
    return await writeSVG(seed);
};