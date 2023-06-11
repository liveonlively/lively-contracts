// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

// import {EnumerableSet} from "@solidstate/contracts/data/EnumerableSet.sol";

struct TokenApprovalRef {
    address value;
}

library ERC721AStorage {
    string private constant CONTRACT_VERSION = "0.0.1";

    // using EnumerableSet for EnumerableSet.UintSet;

    struct Layout {
        /**
         * @dev ERC721A Section
         */
        // The tokenId of the next token to be minted.
        uint256 currentIndex;
        // The number of tokens burned.
        uint256 burnCounter;
        // Token name
        string name;
        // Token symbol
        string symbol;
        // Mapping from token ID to ownership details
        // An empty struct value does not necessarily mean the token is unowned.
        // See {_packedOwnershipOf} implementation for details.
        //
        // Bits Layout:
        // - [0..159]   `addr`
        // - [160..223] `startTimestamp`
        // - [224]      `burned`
        // - [225]      `nextInitialized`
        // - [232..255] `extraData`
        mapping(uint256 => uint256) packedOwnerships;
        // Mapping owner address to address data.
        //
        // Bits Layout:
        // - [0..63]    `balance`
        // - [64..127]  `numberMinted`
        // - [128..191] `numberBurned`
        // - [192..255] `aux`
        mapping(address => uint256) packedAddressData;
        // Mapping from token ID to approved address.
        mapping(uint256 => TokenApprovalRef) tokenApprovals;
        // Mapping from owner to operator approvals
        mapping(address => mapping(address => bool)) operatorApprovals;
        /**
         * @dev Custom ERC721A Variables
         */
        uint256 price;
        uint256 maxSupply;
        string baseTokenUri;
        bool airdrop;
        // bool paused; // Shouldn't be needed with SolidState pausable
        uint256 maxMintPerTx;
        uint256 maxMintPerAddress;
        bool isSoulbound;
    }

    bytes32 internal constant STORAGE_SLOT =
        keccak256("lively.contracts.storage.ERC721A");

    function layout() internal pure returns (Layout storage l) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            l.slot := slot
        }
    }
}
