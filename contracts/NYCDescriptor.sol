pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
//import "@openzeppelin/contracts/utils/Base64.sol";

import "hardhat/console.sol";
import { Base64 } from "./libraries/Base64.sol"; //USE the open zepplin base 64
import { INYCDescriptor } from './interfaces/INYCDescriptor.sol';


contract NYCDescriptor is INYCDescriptor, ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint256 => uint256[]) public heads;
    mapping(uint256 => string[]) public headPalettes;
    Counters.Counter public _headID;
    Counters.Counter public _headPaletteID;

    mapping(uint256 => uint256[]) public skins;
    mapping(uint256 => string[]) public skinPalettes;
    Counters.Counter public _skinID;
    Counters.Counter public _skinPaletteID;

    mapping(uint256 => uint256[]) public jackets;
    mapping(uint256 => string[]) public jacketPalettes;
    Counters.Counter public _jacketID;
    Counters.Counter public _jacketPaletteID;

    mapping(uint => uint[]) public NFTtoRLEindex;

    event NewEpicNFTMinted(address sender, uint256 tokenId);

    constructor() ERC721 ("NYC-NFT", "nameless-youth-club") {
        console.log("Property of namelessyouthclub");
    }

    function makeAnEpicNFT(uint[] calldata seed, string memory url) public {
            uint256 newItemId = _tokenIds.current();
            NFTtoRLEindex[newItemId] = seed;   //[HeadRLE-ID, HeadPallate-ID, SkinRLE-ID, SkinPallate-ID, JacketRLE-ID, JacketPallate-ID]
            
            string memory json = Base64.encode(
                bytes(
                    string(
                        abi.encodePacked(
                            '{"name": "nyc", "description": "A highly acclaimed collection of squares.", "image": "', url,'"}'
                        )
                    )
                )
            );
        // Just like before, we prepend data:application/json;base64, to our data.
            string memory finalTokenUri = string(
                abi.encodePacked("data:application/json;base64,", json)
            );
            console.log("minting.....");
            _safeMint(msg.sender, newItemId);
            
            console.log("setting token ID.....");
            _setTokenURI(newItemId, finalTokenUri);

            _tokenIds.increment();
            console.log("An NFT w/ ID %s has been minted to %s", newItemId, msg.sender);
            emit NewEpicNFTMinted(msg.sender, newItemId);
        }

    
    function addManyColorsToHeadPalette(string[] calldata newColors) external  {
        require(headPalettes[_headPaletteID.current()].length + newColors.length <= 256, 'Palettes can only hold 256 colors');
        for (uint256 i = 0; i < newColors.length; i++) {
            _addColorToHeadPalette(_headPaletteID.current(), newColors[i]);
        }
        _headPaletteID.increment();
    }

    function headCount() public view returns (uint){
        return _headID.current();
    }

    function getHead(uint _id) public view returns (uint[] memory ) {
        return heads[_id];
    }

    function getHeadPalette(uint _id) public view returns (string[] memory) {
        return headPalettes[_id];
    }

      function getSkin(uint _id) public view returns (uint[] memory ) {
        return skins[_id];
    }

    function getSkinPalette(uint _id) public view returns (string[] memory) {
        return skinPalettes[_id];
    }

      function getJacket(uint _id) public view returns (uint[] memory ) {
        return jackets[_id];
    }

    function getJacketPalette(uint _id) public view returns (string[] memory) {
        return jacketPalettes[_id];
    }

    function headPaletteCount() public view returns (uint){
        return _headPaletteID.current();
    }
    

    function jacketCount() public view returns (uint){
        return _jacketID.current();
    }

    function jacketPaletteCount() public view returns (uint){
        return _jacketPaletteID.current();
    }

    function skinCount() public view returns (uint) {
        return _skinID.current();
    }

    function skinPaletteCount() public view returns (uint) {
        return _skinPaletteID.current();
    }
    
    function _addColorToHeadPalette(uint256 _paletteIndex, string calldata _color) internal {
        headPalettes[_paletteIndex].push(_color);
    }

    function addManyColorsToSkinPalette(string[] calldata newColors) external  {
        require(skinPalettes[_skinPaletteID.current()].length + newColors.length <= 256, 'Palettes can only hold 256 colors');
        for (uint256 i = 0; i < newColors.length; i++) {
            _addColorToSkinPalette(_skinPaletteID.current(), newColors[i]);
        }
        _skinPaletteID.increment();
    }
    function _addColorToSkinPalette(uint256 _paletteIndex, string calldata _color) internal {
        skinPalettes[_paletteIndex].push(_color);
    }

    function addManyColorsToJacketPalette(string[] calldata newColors) external  {
        require(jacketPalettes[_jacketPaletteID.current()].length + newColors.length <= 256, 'Palettes can only hold 256 colors');
        for (uint256 i = 0; i < newColors.length; i++) {
            _addColorToJacketPalette(_jacketPaletteID.current(), newColors[i]);
        }
        _jacketPaletteID.increment();
    }
    function _addColorToJacketPalette(uint256 _paletteIndex, string calldata _color) internal {
        jacketPalettes[_paletteIndex].push(_color);
    }

    function addHead(uint256[] calldata _headRLE) external  {
        _addHead(_headRLE);
    }

    function _addHead(uint256[] calldata _headRLE) internal {
        heads[_headID.current()] = _headRLE;
        _headID.increment();
    }

    function addSkin(uint[] calldata _skinRLE) external  {
        _addSkin(_skinRLE);
    }

    function _addSkin(uint[] calldata _skinRLE) internal {
        skins[_skinID.current()] = _skinRLE;
        _skinID.increment();
    }

    function addJacket(uint[] calldata _jacketRLE) external  {
        _addJacket(_jacketRLE);
    }

    function _addJacket(uint[] calldata _jacketRLE) internal {
        jackets[_jacketID.current()] = _jacketRLE;
        _jacketID.increment();
    }

    function RLEtoSVGMain(uint256 _id) public view returns (string memory ){
        uint[] memory componentIdx = NFTtoRLEindex[_id];

        uint headComponent = componentIdx[0];
        uint headPalette = componentIdx[1];

        uint skinComponent = componentIdx[2];
        uint skinPalette = componentIdx[3];

        uint jacketComponent = componentIdx[4];
        uint jacketPalette = componentIdx[5];

        console.log("starting SVG encodes");
        bytes memory finalSVG = (bytes.concat('<svg width="780" height="1000" viewbox ="0,0,780,1000" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">', '<rect width="100%" height="100%" fill="#ffcccb"/>'));
        
        finalSVG = bytes.concat(finalSVG, componentToSVG(skins[skinComponent], skinPalettes[skinPalette]));
        console.log("done skin");

            finalSVG = bytes.concat(finalSVG, componentToSVG(jackets[jacketComponent], jacketPalettes[jacketPalette]));
        console.log("done jacket");
        
        finalSVG = bytes.concat(finalSVG, componentToSVG(heads[headComponent], headPalettes[headPalette]));
        console.log("done head");

        finalSVG = bytes.concat(bytes(finalSVG), bytes('</svg>'));
        console.log(string(finalSVG));
        return string(finalSVG);
    }

    function componentToSVG(uint256[] memory _componentRLE, string[] memory _componentPalette) public view returns (bytes memory) {
            uint endX = _componentRLE[1];
            uint currX = _componentRLE[3];
            uint currY = _componentRLE[0];
            bytes memory finalSVG = "";
            uint idx = 4;
            while (idx < _componentRLE.length){
                uint len = _componentRLE[idx];
                uint color = _componentRLE[idx + 1];
                if (color != 0) {
                    bytes memory newRect = bytes.concat('<rect width="', bytes(Strings.toString(20 * len)), '" height="', bytes(Strings.toString(20)), '" x="', bytes(Strings.toString(currX)), '" y="', bytes(Strings.toString(currY)), '" fill="', bytes(_componentPalette[color]), '"/>');
                    finalSVG = bytes.concat(bytes(finalSVG), bytes(newRect));
                }
                currX += 20 * len;
                if (currX >= endX) {
                    currY += 20;
                    currX = _componentRLE[3];
                    if (currY > ((_componentRLE[0] + _componentRLE[2]) / 2)) {
                        console.log("halfway *******");
                        finalSVG = bytes.concat(bytes(finalSVG), secondHalfToSVG(_componentRLE, _componentPalette, currX, currY, endX, idx += 2));
                        break;
                    }
                }
                idx += 2;
            }
        // finalSVG = bytes.concat(bytes(finalSVG), bytes('</svg>'));
            return finalSVG;
    }

    function secondHalfToSVG(uint256[] memory _componentRLE, string[] memory _componentPalette, uint currX, uint currY, uint endX, uint idx) internal view returns (bytes memory) {
            uint startX = currX;
            bytes memory finalSVG = "";
            while (idx < _componentRLE.length){
                uint len = _componentRLE[idx];
                uint color = _componentRLE[idx + 1];
                if (color != 0) {
                    bytes memory newRect = bytes.concat('<rect width="', bytes(Strings.toString(20 * len)), '" height="', bytes(Strings.toString(20)), '" x="', bytes(Strings.toString(currX)), '" y="', bytes(Strings.toString(currY)), '" fill="', bytes(_componentPalette[color]), '"/>');
                    finalSVG = bytes.concat(bytes(finalSVG), bytes(newRect));
                }
                currX += 20 * len;
                if (currX >= endX) {
                    currY += 20;
                    currX = startX;
                }
                idx += 2;
            }
            return finalSVG;
    }

}