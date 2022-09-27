const RLEtoSVG = require('./RLEtoSVG').default;


export const mintNFT = async (nftSeeder, nftDescriptor, account) => {
    console.log("in mintNFT code")
    const seed = await nftSeeder.generateSeed(nftDescriptor.address);
    //);
    console.log(seed)
    const skin = await nftDescriptor.getSkin(seed[0])
    const skinPalette = await nftDescriptor.getSkinPalette(seed[1])
    const jacket = await nftDescriptor.getJacket(seed[2])
    const jacketPalette = await nftDescriptor.getJacketPalette(seed[3])
    const head = await nftDescriptor.getHead(seed[4])
    const headPalette = await nftDescriptor.getHeadPalette(seed[5])
  

    const mySeed = {
    skin: skin, 
    skinPalette: skinPalette,
    jacket: jacket,
    jacketPalette: jacketPalette,
    head: head,
    headPalette: headPalette
    }
    
    const url = await RLEtoSVG(mySeed);   
    const txn = await nftDescriptor.makeAnEpicNFT(seed, url)
    await txn.wait()
    console.log("completed mint")
}


export default mintNFT