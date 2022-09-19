const RLEtoSVG = require('./RLEtoSVG').default;


export const mintNFT = async (nftSeeder, nftDescriptor, account) => {
    console.log("in mintNFT code")
    await nftSeeder.generateSeed(nftDescriptor.address);
    const wholeSeed = await nftSeeder.seeds(account);
    const skin = await nftDescriptor.getSkin(wholeSeed.skin)
    const skinPalette = await nftDescriptor.getSkinPalette(wholeSeed.skinPalette)
    const head = await nftDescriptor.getHead(wholeSeed.head)
    const headPalette = await nftDescriptor.getHeadPalette(wholeSeed.headPalette)
    const jacket = await nftDescriptor.getJacket(wholeSeed.jacket)
    const jacketPalette = await nftDescriptor.getJacketPalette(wholeSeed.jacketPalette)

    const mySeed = {
    skin: skin, 
    skinPalette: skinPalette,
    jacket: jacket,
    jacketPalette: jacketPalette,
    head: head,
    headPalette: headPalette
    }

    const url = await RLEtoSVG(mySeed);
   
    const txn = await nftDescriptor.makeAnEpicNFT(wholeSeed, url)
    await txn.wait()
    console.log("completed mint")
}


export default mintNFT;