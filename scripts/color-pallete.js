const path = require('path');
const fs = require('fs');


const main = async () => {
  
  const DESCRIPTOR_CONTRACT = "0x4cc165D537e06365Bd5F1402c0227b358D632434"
  const nftDescriptor = await hre.ethers.getContractAt("NYCDescriptor", DESCRIPTOR_CONTRACT);
  console.log(nftDescriptor)
  console.log(await nftDescriptor.getSkin(0))

  //HEAD ------------------------------
  const filenameHead = path.normalize(__dirname + "/../Palettes/RLE_Colors_head.txt")
  const allFileContentsHead = fs.readFileSync(filenameHead, 'utf-8');
  allFileContentsHead.split(/\r?\n/).forEach(async (line) =>  {
    if (line != "") {
         line = line.substring(1, line.length - 1)
         line = line.split(', ')
         const headPaletteTxn = await nftDescriptor.addManyColorsToHeadPalette(line)
         await headPaletteTxn.wait()
    }
  });
  //______________________________________________________________________________________________
  // SKIN -----------------------------------

  //______________________________________________________________________________________________
  //JACKET________________________________________
  const filenameSkin = path.normalize(__dirname + "/../Palettes/RLE_Colors_body.txt")
  const allFileContentsSkin = fs.readFileSync(filenameSkin, 'utf-8');
  allFileContentsSkin.split(/\r?\n/).forEach(async (line) =>  {
    if (line != "") {
         line = line.substring(1, line.length - 1)
         line = line.split(', ')
         const jacketColorTxn = await nftDescriptor.addManyColorsToJacketPalette(line)
         await jacketColorTxn.wait()
    }
  });
  //______________________________________________________________________________________________________
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();