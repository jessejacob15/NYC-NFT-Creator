pragma solidity ^0.8.9;

import { INYCSeeder } from './INYCSeeder.sol';

interface INYCDescriptor {
    
    function jacketCount() external view returns (uint256);

    function headCount() external view returns (uint256);

    function skinCount() external view returns (uint256);

    function jacketPaletteCount() external view returns (uint256);

    function headPaletteCount() external view returns (uint256);

    function skinPaletteCount() external view returns (uint256);

    function addManyPalettesToHeadPalette(string[][] calldata newPalettes) external;

    function addPaletteToSkinPalette(string[] calldata newColors) external;

    function addManyPalettesToJacketPalette(string[][] calldata newPalettes) external;

    function addHead(uint[] calldata _headRLE) external;

    function addSkin(uint[] calldata _skinRLE) external;

    function addJacket(uint[] calldata _jacketRLE) external;

    function RLEtoSVGMain(uint256 _id) external view returns (string memory );

    function componentToSVG(uint256[] memory _componentRLE, string[] memory _componentPalette) external view returns (bytes memory);

   
}
