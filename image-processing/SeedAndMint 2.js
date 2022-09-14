const RLEtoSVG = require('./RLEtoSVG').default;
const ethers = require('ethers')

const NYCDescriptor = require('../server/utils/NYCDescriptor.json');
const NYCSeeder = require('../server/utils/NYCSeeder.json');


async function mintNFT(request) {
   

    const nftSeeder = new ethers.Contract(request.seedContract, NYCSeeder.abi, request.signer);
    const nftDescriptor = new ethers.Contract(request.desciptorContract, NYCDescriptor.abi, request.signer)

    console.log("in mintNFT code")
    const seed = await nftSeeder.generateSeed(nftDescriptor.address);
    const wholeSeed = await nftSeeder.seeds(request.account);
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


module.exports = async function (seeder, desciptor, account, signer) { 
    return await mintNFT(seeder, desciptor, account, signer);
};