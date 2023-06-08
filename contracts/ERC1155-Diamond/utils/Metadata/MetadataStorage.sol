// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { TokenMetadata } from "../../libraries/TokenMetadata.sol";

library MetadataStorage {
    string private constant CONTRACT_VERSION = "0.0.1";

    // struct Attribute {
    //     string trait_type;
    //     string value;
    // }
    struct Metadata {
        string description;
        string external_url;
        string image;
        string name;
        string animation_url; // https://golive.ly/metadata/1155/animations/{id}.mp4
        TokenMetadata.Attribute[] attributes; // [{ "trait_type": "Artist", "value": "Artist Name"}]
    }

    struct Layout {
        mapping(uint256 => Metadata) metadata;
    }

    bytes32 internal constant STORAGE_SLOT = keccak256("lively.contracts.storage.MetadataStorage");

    function layout() internal pure returns (Layout storage l) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            l.slot := slot
        }
    }
}
