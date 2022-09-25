require("dotenv").config({ path: ".env" });
var Web3 = require('web3');

const NYCDescriptor = require('../artifacts/contracts/NYCDescriptor.sol/NYCDescriptor.json');
const Provider = require('@truffle/hdwallet-provider');

/// run node scripts/color-palette.js
//  add colors where appropriate 


const PRIVATE_KEY = process.env.PRIVATE_KEY
const QUICKNODE_API_KEY_URL_GOERLI = process.env.QUICKNODE_API_KEY_URL_GOERLI

const main = async () => {
  var provider = new Provider(PRIVATE_KEY, QUICKNODE_API_KEY_URL_GOERLI);
  var web3 = new Web3(provider);
  const address = "0x5C811f2212aAF0393D7786d7625Ae72AF2A9E405"
  
  const DESCRIPTOR_CONTRACT = "0x8Bc3345e219ef14d1137435ded9f6c454F8136Af"
  //const nftDescriptor = await hre.ethers.getContractAt("NYCDescriptor", DESCRIPTOR_CONTRACT);
  const nftDescriptor = new web3.eth.Contract(NYCDescriptor.abi, DESCRIPTOR_CONTRACT)

  //HEAD ------------------------------
  
  const headPalettes = [
    ['#00000000', '#25202e', '#2e2534', '#3e3143', '#433749', '#312a3c', '#69577a', '#201a26', '#100e17', '#00040a', '#544662', '#181420', '#080b13', '#5f4d68', '#806d90', '#181a26', '#413f5e', '#4c456c', '#090e1d', '#11121d', '#3b364b', '#50415a', '#79607e', '#08040a', '#696286', '#816688', '#333044', '#3d2a2e', '#5c526d', '#1d1717', '#2a2b3b', '#000204', '#433b50', '#57445a', '#09090c', '#1b0f0f', '#281d20', '#2d2128', '#6e5a73', '#120a0c', '#241612', '#2e1c15', '#1b1105', '#160800', '#22120a', '#0a0404'],

    ['#00000000', '#d6c7ba', '#ffe4d0', '#313c06', '#354306', '#fffff2', '#546b0b', '#b6a397', '#5b565a', '#001b2a', '#435609', '#8a7c7f', '#2f414c', '#4c5e09', '#66850c', '#8aa39a', '#344d08', '#3d5409', '#335973', '#626e75', '#2f4207', '#405008', '#61750b', '#2c182a', '#54780c', '#677d0c', '#ffffff', '#ffffb7', '#496409', '#a38b5d', '#f0ffed', '#000c0f', '#364807', '#455308', '#333831', '#985f3d', '#e5b27f', '#ffcaa1', '#586e0a', '#663e2e', '#cb8547', '#ffac53', '#986b16', '#7b2f00', '#c06e2a', '#361b0f'],
    
    ['#00000000', '#ffffff', '#ffffff', '#ad8e0a', '#bb9e0b', '#ffffff', '#fffa12', '#ffeeff', '#947ec7', '#00275c', '#edc90e', '#e1b6ff', '#4d5fa7', '#ffdc0f', '#ffff15', '#e1eeff', '#b6b60e', '#d6c510', '#5382fd', '#a0a0ff', '#a69a0b', '#e0bb0d', '#ffff12', '#47235c', '#ffff13', '#ffff14', '#ffffff', '#ffffff', '#ffeb10', '#ffcccd', '#ffffff', '#001120', '#bda90c', '#f4c20d', '#53526c', '#f88b87', '#ffffff', '#ffffff', '#ffff11', '#a65b66', '#ffc39c', '#fffbb7', '#f89c30', '#c94500', '#ffa05c', '#592720'],
    
    ['#00000000', '#8471f4', '#a382ff', '#7a127c', '#841486', '#ac93ff', '#cf1fe0', '#705dc7', '#383177', '#000f37', '#a719b5', '#5547a7', '#1d2564', '#bc1bc0', '#fd27ff', '#555dca', '#8016ad', '#9618c6', '#1f3397', '#3c3e9a', '#75138a', '#9e17a5', '#ef22e9', '#1b0d37', '#d023f6', '#ff24fa', '#b3a8ff', '#d794f1', '#b61dc8', '#654f7a', '#9396ff', '#000713', '#851593', '#ac18a5', '#1f2040', '#5e3650', '#8d65a7', '#9f73d4', '#d920d3', '#3f233d', '#7d4c5d', '#a1626d', '#5e3d1d', '#4c1b00', '#763e37', '#220f13'],
    
    ['#00000000', '#fd034c', '#ff0355', '#3c9365', '#41a56d', '#ff0463', '#66ffb7', '#d6023e', '#6b0125', '#000011', '#52d194', '#a30234', '#38011f', '#5de59d', '#7dffd8', '#a3023f', '#3fbd8d', '#4acda2', '#3c012f', '#740230', '#3aa071', '#4ec387', '#76ffbe', '#330011', '#67ffc9', '#7effcc', '#ff046e', '#ff044b', '#5af5a4', '#c10226', '#ff0461', '#000006', '#42b078', '#55ca87', '#3c0114', '#b40119', '#ff0334', '#ff0342', '#6bffad', '#780113', '#f0021d', '#ff0322', '#b40209', '#920100', '#e30211', '#400006'],
    
    ['#00000000', '#679a76', '#7fb284', '#a9eeaa', '#b7ffb8', '#86c999', '#ffffff', '#577f60', '#2c4339', '#00151a', '#e8fff9', '#426151', '#173330', '#ffffff', '#ffffff', '#427f62', '#b2ffef', '#d1ffff', '#184549', '#2f554a', '#a2ffbf', '#dbffe4', '#ffffff', '#15121a', '#ffffff', '#ffffff', '#8be7ac', '#a7cb74', '#fcffff', '#4e6c3b', '#73cd96', '#000909', '#b9ffcb', '#efffe4', '#182c1f', '#494a27', '#6e8a51', '#7c9d66', '#ffffff', '#31301d', '#62682d', '#7d8635', '#49530e', '#3b2500', '#5c551a', '#1a1509'],
    
    ['#00000000', '#124aff', '#1655ff', '#8c3f19', '#98461b', '#1760ff', '#ee6f2e', '#0f3dd5', '#08207f', '#000a3a', '#c05925', '#0b2eb3', '#04186b', '#d86227', '#ff8b36', '#0b3dd9', '#935123', '#ad5728', '#0421a2', '#0829a5', '#86451c', '#b65322', '#ff7a30', '#04093a', '#f07d32', '#ff8233', '#186eff', '#1d61ff', '#d16929', '#0e3483', '#1462ff', '#000415', '#994b1e', '#c65622', '#041545', '#0d2356', '#1342b3', '#154be3', '#fa722b', '#081741', '#113264', '#164075', '#0d281f', '#0a1200', '#10293a', '#050a15'],
    
    ['#00000000', '#771e35', '#94233c', '#91649f', '#9d70ac', '#9c2745', '#f6b1ff', '#65192b', '#330d1a', '#00040c', '#c68ee8', '#4d1324', '#1a0a16', '#e09bf7', '#ffddff', '#4d192c', '#9880de', '#b38bfe', '#1c0d21', '#371122', '#8b6db1', '#bc84d4', '#ffc2ff', '#18040c', '#f8c6ff', '#ffcfff', '#a22d4e', '#c22835', '#d8a6ff', '#5b151b', '#862844', '#000204', '#9e77bd', '#cc89d4', '#1c090e', '#550e12', '#801b24', '#901f2e', '#ffb6ff', '#39090d', '#711414', '#921a18', '#551006', '#450700', '#6b110c', '#1e0404'],
    
    ['#00000000', '#7eff45', '#9cff4d', '#4c9b28', '#52ad2b', '#a5ff5a', '#81ff49', '#6bff38', '#36a221', '#00320f', '#68db3b', '#51eb2f', '#1c7b1c', '#75f03e', '#9eff56', '#51ff39', '#50c638', '#5ed740', '#1ea82b', '#3acf2b', '#49a82d', '#62cc36', '#95ff4c', '#1a2d0f', '#82ff50', '#9fff51', '#abff64', '#ceff44', '#71ff41', '#60ff22', '#8dff58', '#001605', '#53b930', '#6bd436', '#1e6a12', '#5ab317', '#87ff2f', '#98ff3c', '#87ff45', '#3c7511', '#78fc1a', '#9aff1f', '#5ac908', '#495900', '#71cf0f', '#203205'],
    
    ['#00000000', '#a61cd1', '#cd20ea', '#ff2aff', '#ff2fff', '#d824ff', '#ff4bff', '#8d17aa', '#460c66', '#00042f', '#ff3cff', '#6b118f', '#250955', '#ff42ff', '#ff5dff', '#6b17ad', '#ff36ff', '#ff3bff', '#270c81', '#4c0f84', '#ff2eff', '#ff38ff', '#ff52ff', '#22032f', '#ff54ff', '#ff58ff', '#e129ff', '#ff24ce', '#ff46ff', '#7e1368', '#ba25ff', '#000210', '#ff33ff', '#ff3aff', '#270837', '#760d45', '#b1198f', '#c81cb5', '#ff4dff', '#4f0934', '#9d1250', '#ca185d', '#760f19', '#600700', '#950f2f', '#2a0410'],
    
    ['#00000000', '#ffffff', '#ffffff', '#5e7608', '#658408', '#ffffff', '#9fd10e', '#ffffff', '#94a1a2', '#00324a', '#80a80b', '#e1eae3', '#4d7b87', '#91b80c', '#c3ff11', '#e1ffff', '#62980b', '#74a40c', '#53a7cd', '#a0ced2', '#5a8109', '#7a9c0a', '#b8e60f', '#472d4a', '#a0ea0f', '#c5f510', '#ffffff', '#ffffff', '#8cc40d', '#ffffa6', '#ffffff', '#00161a', '#668d09', '#84a20a', '#536a57', '#f8b26d', '#ffffe3', '#ffffff', '#a7d70d', '#a67553', '#fffb7f', '#ffff94', '#f8c827', '#c95900', '#ffce4a', '#59321a'],
    
    ['#00000000', '#92ab21', '#b5c425', '#f0ff30', '#ffff34', '#bfdd2b', '#ffff57', '#7c8c1b', '#3e4a10', '#001707', '#ffff46', '#5e6b17', '#20380e', '#ffff4b', '#ffff67', '#5e8c1b', '#fcff43', '#ffff4d', '#234c15', '#435e15', '#e6ff36', '#ffff40', '#ffff5a', '#1e1407', '#ffff60', '#ffff61', '#c6ff30', '#eee021', '#ffff4e', '#6f7811', '#a3e32a', '#000a03', '#ffff39', '#ffff40', '#233009', '#68510b', '#9c9917', '#b0ad1d', '#ffff52', '#453508', '#8b730d', '#b2940f', '#685c04', '#542900', '#835e07', '#251703']
     
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