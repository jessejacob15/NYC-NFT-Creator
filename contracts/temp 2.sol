pragma solidity ^0.8.9;


import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";
import { Base64 } from "./libraries/Base64.sol";


// We need to import the helper functions from the contract that we copy/pasted.


contract temp is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  mapping(uint256 => uint256[]) public heads;
  mapping(uint256 => string[]) public headPalettes;
  uint8 headID = 0;
  uint8 headPaletteID = 0;

  mapping(uint256 => uint256[]) public skins;
  mapping(uint256 => string[]) public skinPalettes;
  uint8 skinID = 0;
  uint8 skinPaletteID = 0;

  mapping(uint256 => uint256[]) public jackets;
  mapping(uint256 => string[]) public jacketPalettes;
  uint8 jacketID = 0;
  uint8 jacketPaletteID = 0;

  mapping(uint => uint[]) public NFTtoRLEindex;

  constructor() ERC721 ("SquareNFT", "SQUARE") {
    console.log("This is my NFT contract. Woah!");
  }

  function makeAnEpicNFT(uint[] calldata componentIdx, string memory url) public {
    uint256 newItemId = _tokenIds.current();
    // Get all the JSON metadata in place and base64 encode it.
    string memory finalSvg = RLEtoSVGMain(newItemId);
    NFTtoRLEindex[newItemId] = componentIdx;   //[HeadRLE-ID, HeadPallate-ID, SkinRLE-ID, SkinPallate-ID, JacketRLE-ID, JacketPallate-ID]
    string memory json = Base64.encode(
        bytes(
            // string(
            //     abi.encodePacked(
            //         '{"name": "nyc", "description": "A highly acclaimed collection of squares.", "image": ', url,'"}'
            //     )
            // )
               string(
                abi.encodePacked(
                    '{"name": "nyc", "description": "A highly acclaimed collection of squares.", "image": "data:image/svg+xml;base64,',
                    // We add data:image/svg+xml;base64 and then append our base64 encode our svg.
                    Base64.encode(bytes(finalSvg)),
                    '"}'
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
    }

    function addManyColorsToHeadPalette(string[] calldata newColors) external  {
        require(headPalettes[headPaletteID].length + newColors.length <= 256, 'Palettes can only hold 256 colors');
        for (uint256 i = 0; i < newColors.length; i++) {
            _addColorToHeadPalette(headPaletteID, newColors[i]);
        }
        headPaletteID += 1;
    }
    function _addColorToHeadPalette(uint8 _paletteIndex, string calldata _color) internal {
        headPalettes[_paletteIndex].push(_color);
    }

    function addManyColorsToSkinPalette(string[] calldata newColors) external  {
        require(skinPalettes[skinPaletteID].length + newColors.length <= 256, 'Palettes can only hold 256 colors');
        for (uint256 i = 0; i < newColors.length; i++) {
            _addColorToSkinPalette(skinPaletteID, newColors[i]);
        }
        skinPaletteID += 1;
    }
    function _addColorToSkinPalette(uint8 _paletteIndex, string calldata _color) internal {
        skinPalettes[_paletteIndex].push(_color);
    }

    function addManyColorsToJacketPalette(string[] calldata newColors) external  {
        require(jacketPalettes[jacketPaletteID].length + newColors.length <= 256, 'Palettes can only hold 256 colors');
        for (uint256 i = 0; i < newColors.length; i++) {
            _addColorToJacketPalette(jacketPaletteID, newColors[i]);
        }
        jacketPaletteID += 1;
    }
    
    function _addColorToJacketPalette(uint8 _paletteIndex, string calldata _color) internal {
        jacketPalettes[_paletteIndex].push(_color);
    }

    function addHead(uint256[] calldata _headRLE) external  {
        _addHead(_headRLE);
    }

    function _addHead(uint256[] calldata _headRLE) internal {
        heads[headID] = _headRLE;
        headID += 1;
    }

    function addSkin(uint[] calldata _skinRLE) external  {
        _addSkin(_skinRLE);
    }

    function _addSkin(uint[] calldata _skinRLE) internal {
        skins[skinID] = _skinRLE;
        skinID += 1;
    }

    function addJacket(uint[] calldata _jacketRLE) external  {
        _addJacket(_jacketRLE);
    }

    function _addJacket(uint[] calldata _jacketRLE) internal {
        jackets[jacketID] = _jacketRLE;
        jacketID += 1;
    }

    function RLEtoSVGMain(uint256 _id) public view returns (string memory ){
        console.log("RLEtoSVG");
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
            }
            //console.log(idx);
            idx += 2;
        }
        //finalSVG = bytes.concat(bytes(finalSVG), bytes('</svg>'));
        //console.log(string(finalSVG));
        return finalSVG;
  }


}