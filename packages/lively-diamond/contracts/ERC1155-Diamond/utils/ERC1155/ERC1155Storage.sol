// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

library ERC1155Storage {
    string private constant CONTRACT_VERSION = "0.0.1";

    struct TokenStructure {
        uint256 maxSupply;
        uint256 price;
        address creator;
        string tokenUri; // Optional, baseUri is set in ERC1155MetadataStorage (https://sample.com/{id}.json) would be valid)
        bool allowListEnabled;
        uint256 startTime;
        bool isCrossmintUSDC;
    }

    struct PackStructure {
        uint256 price;
        uint256 startTime;
        uint256[] tokenIds;
    }

    struct Layout {
        uint256 currentTokenId;
        bool airdrop;
        string name;
        string symbol;
        string contractURI;
        mapping(uint256 => uint256) maxSupply;
        mapping(uint256 => uint256) price;
        mapping(uint256 => address) creator;
        mapping(uint256 => string) tokenUri;
        mapping(uint256 => bool) allowListEnabled;
        mapping(uint256 => TokenStructure) tokenData;
        bool isPriceUSD;
        bool automaticUSDConversion;
        uint256 currentPackId;
        mapping(uint256 => PackStructure) packData;
    }

    bytes32 internal constant STORAGE_SLOT = keccak256("lively.contracts.storage.ERC1155");

    function layout() internal pure returns (Layout storage l) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            l.slot := slot
        }
    }

    function tokenData(uint256 _tokenId) internal view returns (TokenStructure storage) {
        return layout().tokenData[_tokenId];
    }

    function packData(uint256 _packId) internal view returns (PackStructure storage) {
        return layout().packData[_packId];
    }

    function incrementPackId(Layout storage l) internal {
        l.currentPackId++;
    }

    function getCurrentPackId(Layout storage l) internal view returns (uint256) {
        return l.currentPackId;
    }
}
