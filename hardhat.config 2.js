require('@nomiclabs/hardhat-waffle');
require("dotenv").config({ path: ".env" });
require("hardhat-gas-reporter");


module.exports = {
  solidity: '0.8.9',
  networks: {
    rinkeby: {
      url: process.env.QUICKNODE_API_KEY_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 4
      // gasPrice: 20e9,
      // gas: 25e6,
    },
    kovan: {
      url: process.env.QUICKNODE_API_KEY_URL_KOVAN,
      accounts: [process.env.PRIVATE_KEY],
    },
    // hardhat: {
    //     blockGasLimit: 100000000429720 // whatever you want here
    // },
  }
}








