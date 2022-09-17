pragma solidity ^0.8.9;


import { INYCSeeder } from './interfaces/INYCSeeder.sol';
import { INYCDescriptor } from './interfaces/INYCDescriptor.sol';
import "hardhat/console.sol";



contract NYCSeeder is INYCSeeder {
    mapping(address => Seed) public seeds;

    function generateSeed(INYCDescriptor descriptor) external returns (Seed memory) {

        uint256 skinCount = descriptor.skinCount();
        uint256 jacketCount = descriptor.jacketCount();
        uint256 headCount = descriptor.headCount();

        uint256 skinPaletteCount = descriptor.skinPaletteCount();
        uint256 jacketPaletteCount = descriptor.jacketPaletteCount();
        uint256 headPaletteCount = descriptor.headPaletteCount();

        Seed memory mySeed = Seed({
            
            skin: uint48(
                random() % skinCount
            ),
            skinPalette: uint48(
                random() % skinPaletteCount
            ),
            jacket: uint48(
                random() % jacketCount

            ),
            jacketPalette: uint48(
                random() % jacketPaletteCount
            ),
            head: uint48(
                random() % headCount
            ),
            headPalette: uint48(
                random() % headPaletteCount
            )
        });
        seeds[msg.sender] = mySeed;
        return mySeed;
    }

    function random() private view returns (uint) {
        // sha3 and now have been deprecated
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp)));
        // convert hash to integer
        // players is an array of entrants
        
    }
}

  



