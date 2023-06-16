// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

// import {EnumerableSet} from "@solidstate/contracts/data/EnumerableSet.sol";

struct Edition {
    string name;
    uint256 maxSupply;
    uint256 totalSupply;
    uint256 price;
}

library EditionsStorage {
    string private constant CONTRACT_VERSION = "0.0.1";

    // using EnumerableSet for EnumerableSet.UintSet;

    struct Layout {
        /**
         * @dev Editions
         */
        bool editionsEnabled;
        Edition[] editionsByIndex; // Editions
        mapping(uint256 => uint256) tokenEdition; // idToken => editionIndex // Deprecated
    }

    bytes32 internal constant STORAGE_SLOT = keccak256("lively.contracts.storage.Editions");

    function layout() internal pure returns (Layout storage l) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            l.slot := slot
        }
    }
}
