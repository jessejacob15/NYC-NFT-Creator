require("dotenv").config({ path: ".env" });
var Web3 = require('web3');

const NYCDescriptor = require('../artifacts/contracts/NYCDescriptor.sol/NYCDescriptor.json');
const Provider = require('@truffle/hdwallet-provider');

/// run node scripts/color-palette.js
//  add colors where appropriate 


const PRIVATE_KEY = process.env.PRIVATE_KEY
const QUICKNODE_API_KEY_URL = process.env.QUICKNODE_API_KEY_URL
console.log(PRIVATE_KEY)

const main = async () => {
  var provider = new Provider(PRIVATE_KEY, QUICKNODE_API_KEY_URL);
  var web3 = new Web3(provider);
  const address = "0x5C811f2212aAF0393D7786d7625Ae72AF2A9E405"
  
  const DESCRIPTOR_CONTRACT = "0x2AF31eA5DCA17f3AfC46f6AbEEB0532849aa4EC5"
  //const nftDescriptor = await hre.ethers.getContractAt("NYCDescriptor", DESCRIPTOR_CONTRACT);
  const nftDescriptor = new web3.eth.Contract(NYCDescriptor.abi, DESCRIPTOR_CONTRACT)

  //HEAD ------------------------------
  
  const headPalettes = [
    ['#00000000', '#a425c1', '#cb2ad8', '#ff38ff', '#ff3fff', '#d730fc', '#ff64ff', '#8b1e9e', '#46105e', '#00052b', '#ff50ff', '#6a1784', '#240c4f', '#ff58ff', '#ff7cff', '#6a1ea0', '#ff48ff', '#ff4eff', '#271077', '#4b147a', '#ff3dff', '#ff4bff', '#ff6eff', '#21042b', '#ff70ff', '#ff75ff', '#df37ff', '#ff30bf', '#ff5eff', '#7d1a61', '#b831f7', '#00020f', '#ff43ff', '#ff4dff', '#270a33', '#751240', '#b02184', '#c625a8', '#ff66ff', '#4e0c30', '#9c194a', '#c92056', '#751417', '#5f0900', '#94142b', '#2a050f'],
    ['#00000000', '#6e5b8e', '#88699f', '#b58ccd', '#c49cde', '#9076b9', '#fff7ff', '#5d4b74', '#2f2745', '#000c20', '#f8c6ff', '#473961', '#181e3a', '#ffd9ff', '#ffffff', '#474b76', '#beb3ff', '#e0c2ff', '#1a2958', '#32325a', '#ae98e5', '#ebb9ff', '#ffffff', '#160b20', '#ffffff', '#ffffff', '#9588cf', '#b3788c', '#ffe8ff', '#544047', '#7b79b5', '#00050b', '#c6a7f4', '#ffc0ff', '#1a1a25', '#4e2b2f', '#765261', '#845c7b', '#fffeff', '#341d23', '#683d36', '#864f3f', '#4e3111', '#3f1600', '#633220', '#1c0c0b'],
    ['#00000000', '#b65304', '#e15f05', '#ff7f06', '#ff8e06', '#ee6b05', '#ffe00b', '#9a4403', '#4d2402', '#000b01', '#ffb409', '#753403', '#281b02', '#ffc509', '#ffff0d', '#754403', '#ffa308', '#ffb00a', '#2b2503', '#532e03', '#ff8a07', '#ffa808', '#fff70b', '#250a01', '#fffc0c', '#ffff0c', '#f77b06', '#ff6c04', '#ffd30a', '#8b3a02', '#cc6e05', '#000500', '#ff9807', '#ffae08', '#2b1701', '#822701', '#c24a03', '#db5404', '#ffe70a', '#561a01', '#ad3702', '#de4802', '#822c00', '#691400', '#a32e01', '#2e0b00'],
    ['#00000000', '#688aff', '#819fff', '#988022', '#a58f25', '#88b4ff', '#ffe23e', '#5872ff', '#2c3ca4', '#00134b', '#d1b532', '#4357e7', '#172d89', '#ebc735', '#ffff49', '#4372ff', '#a0a430', '#bcb237', '#193ed0', '#304cd5', '#928b26', '#c6a92e', '#fff941', '#15114b', '#fffe44', '#ffff45', '#8ecfff', '#aab6ff', '#e4d438', '#5061a8', '#75b8ff', '#00081b', '#a69929', '#d7af2e', '#192759', '#4a426f', '#6f7ce7', '#7e8cff', '#ffe83b', '#322b54', '#635d81', '#7f7897', '#4a4a28', '#3c2100', '#5e4c4b', '#1b131b'],
    ['#00000000', '#b66dcf', '#e17ee8', '#ffa8ff', '#ffbcff', '#ee8eff', '#ffffff', '#9a5aa9', '#4d2f65', '#000f2e', '#ffeeff', '#75458e', '#282455', '#ffffff', '#ffffff', '#755aac', '#ffd7ff', '#ffe9ff', '#2b3180', '#533c83', '#ffb7ff', '#ffdeff', '#ffffff', '#250d2e', '#ffffff', '#ffffff', '#f7a3ff', '#ff90cd', '#ffffff', '#8b4d68', '#cc91ff', '#000710', '#ffc9ff', '#ffe6ff', '#2b1f37', '#823444', '#c2628e', '#db6fb4', '#ffffff', '#562234', '#ad494f', '#de5f5d', '#823b19', '#691a00', '#a33c2e', '#2e0f10'],
    ['#00000000', '#36ff71', '#42ff7f', '#3a1b64', '#3f1e6c', '#46ff94', '#6330b4', '#2dd75d', '#177137', '#002319', '#502792', '#22a44e', '#0c562e', '#5a2a9b', '#793cd5', '#22d75e', '#3d238c', '#4826a0', '#0d7546', '#199148', '#381e70', '#4b2485', '#7235bc', '#0b1f19', '#6336c7', '#7a38c9', '#49ffa6', '#57ff70', '#572da1', '#29b839', '#3cff91', '#001009', '#3f2177', '#522585', '#0d4a1e', '#267d25', '#39ea4e', '#40ff63', '#6832aa', '#19521c', '#33b02b', '#41e333', '#268d0d', '#1f3f00', '#309119', '#0e2309'],
    ['#00000000', '#42b811', '#52d313', '#6dff18', '#76ff1a', '#56ee16', '#b9ff2b', '#38970e', '#1c4f08', '#001904', '#95ff23', '#2b730b', '#0f3c07', '#a8ff25', '#e2ff33', '#2b970e', '#72ff22', '#86ff26', '#10520a', '#1e650a', '#68ff1b', '#8dff20', '#d6ff2d', '#0d1604', '#baff30', '#e4ff30', '#5aff18', '#6bf110', '#a2ff27', '#328108', '#4af415', '#000b01', '#77ff1d', '#99ff20', '#103404', '#2f5805', '#47a40b', '#4fba0e', '#c2ff29', '#1f3a04', '#3f7b06', '#519f07', '#2f6302', '#262c00', '#3b6504', '#111901'],
    ['#00000000', '#f6ffff', '#ffffff', '#9f9308', '#aca508', '#ffffff', '#ffff0e', '#d0ffff', '#6889d3', '#002b61', '#dad10b', '#9ec7ff', '#3668b1', '#f6e50c', '#ffff11', '#9effff', '#a7bd0b', '#c5cd0c', '#3a8eff', '#70afff', '#99a009', '#cfc30a', '#ffff0f', '#322661', '#ffff0f', '#ffff10', '#ffffff', '#ffffff', '#eef50d', '#bbdfd9', '#ffffff', '#001322', '#aeb009', '#e1ca0a', '#3a5a72', '#af988e', '#ffffff', '#ffffff', '#ffff0d', '#75636c', '#e9d5a5', '#ffffc2', '#afab33', '#8e4c00', '#ddaf61', '#3e2b22'],
    ['#00000000', '#269f92', '#30b7a3', '#571e69', '#5e2172', '#32cfbe', '#9435be', '#218377', '#104547', '#001521', '#772a9a', '#196464', '#08343c', '#862ea3', '#b542e0', '#198379', '#5b2693', '#6b29a8', '#09475a', '#12585c', '#532075', '#71278c', '#ab3ac5', '#081321', '#943bd1', '#b63ed4', '#34eed5', '#3fd190', '#8232aa', '#1d7049', '#2bd4ba', '#000a0c', '#5f247d', '#7a298c', '#092d26', '#1b4c30', '#298f64', '#2ea27f', '#9b36b3', '#123225', '#246b38', '#2f8a41', '#1b5611', '#162600', '#235821', '#0a150c'],
    ['#00000000', '#0c976f', '#0fad7c', '#15e8a1', '#16ffae', '#10c491', '#23ffff', '#0b7c5b', '#054136', '#001419', '#1cffeb', '#085e4c', '#03312d', '#20fffa', '#2bffff', '#087c5c', '#16ffe1', '#19ffff', '#034345', '#065346', '#14fcb4', '#1bffd7', '#28ffff', '#031219', '#23ffff', '#2bffff', '#11e1a2', '#14c66e', '#1fffff', '#0a6a38', '#0ec88e', '#000909', '#16ffbf', '#1dffd7', '#032b1d', '#094825', '#0d874c', '#0f9960', '#25ffff', '#062f1c', '#0c652a', '#0f8232', '#09510d', '#072400', '#0b5319', '#031409'],
    ['#00000000', '#97af92', '#bbc9a3', '#f9ffd3', '#ffffe4', '#c5e3be', '#ffffff', '#809077', '#404c47', '#001821', '#ffffff', '#616e64', '#213a3c', '#ffffff', '#ffffff', '#619079', '#ffffff', '#ffffff', '#244e5a', '#45615c', '#eeffec', '#ffffff', '#ffffff', '#1f1521', '#ffffff', '#ffffff', '#cdffd5', '#f6e690', '#ffffff', '#737b49', '#a9e9ba', '#000a0c', '#fffffc', '#ffffff', '#243226', '#6c5430', '#a19d64', '#b6b27f', '#ffffff', '#483724', '#8f7638', '#b89841', '#6c5e11', '#572a00', '#886121', '#26180c'],
    ['#00000000', '#a1a8bb', '#c8c1d2', '#ffffff', '#ffffff', '#d3daf4', '#ffffff', '#898a99', '#44495b', '#00172a', '#ffffff', '#686980', '#24374c', '#ffffff', '#ffffff', '#688a9b', '#ffffff', '#ffffff', '#264b74', '#4a5d76', '#feffff', '#ffffff', '#ffffff', '#21142a', '#ffffff', '#ffffff', '#dbfbff', '#ffddb9', '#ffffff', '#7b765e', '#b5e0ef', '#000a0f', '#ffffff', '#ffffff', '#263031', '#73503e', '#ac9780', '#c2aba3', '#ffffff', '#4d352f', '#997147', '#c59254', '#735a16', '#5d2800', '#915d2a', '#29170f']
  ]
  
  let txn = await nftDescriptor.methods.addManyPalettesToHeadPalette(headPalettes).send({from: address})
  //await txn.wait()
  console.groupCollapsed("finished")
  //______________________________________________________________________________________________
  // SKIN -----------------------------------

  //______________________________________________________________________________________________
  //JACKET________________________________________
  // const filenameSkin = path.normalize(__dirname + "/../Palettes/RLE_Colors_body.txt")
  // const allFileContentsSkin = fs.readFileSync(filenameSkin, 'utf-8');
  // allFileContentsSkin.split(/\r?\n/).forEach(async (line) =>  {
  //   if (line != "") {
  //        line = line.substring(1, line.length - 1)
  //        line = line.split(', ')
  //        const jacketColorTxn = await nftDescriptor.addManyColorsToJacketPalette(line)
  //        await jacketColorTxn.wait()
  //   }
  // });
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