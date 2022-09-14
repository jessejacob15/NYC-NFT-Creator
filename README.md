# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
GAS_REPORT=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
```



1) python client sends contract RLE data and palattes after parsing png images and contract stores in mappings on chain

2) python client calls seeder, contract randomizes component and palette and creates mapping entry of (NFTid => RLE compoenents)
    ******NOTE should the mapping be created here? NFT has not been minted yet !!
    contract sends back RLE + palette components to python script 

3) python script builds svg off chain and sends completed to IPFS API to get URL

4) python script sends IPFS URL and the NFT ID back to the contract to mint 

