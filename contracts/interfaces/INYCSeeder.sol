pragma solidity ^0.8.9;

import { INYCDescriptor } from './INYCDescriptor.sol';

interface INYCSeeder {
    struct Seed {
        uint48 skin;
        uint48 skinPalette;
        uint48 jacket;
        uint48 jacketPalette;
        uint48 head;
        uint48 headPalette;
    }

    // function generateSeed(INYCDescriptor descriptor) external returns (Seed memory);
    function generateSeed(INYCDescriptor descriptor) external returns (uint48[6] memory);

}
