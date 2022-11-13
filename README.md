# Nameless Youth Club Development Structure



## Python Scripts
./python-svg-work/scripts

### Main achievements
1) RLE Creation: Broke down original image using python image library in order to generate RLE (row line endcoding) for each component (head, jacket, skin). This is done using the cImage.py library. To print RLE from a component PNG file run ```python3 componentToRLE.py``` and follow prompts

2) Palette Generation: created color palletes using machine learning techniques to maintain depth of original image coloring with different base colors


## Hardhat Project


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

