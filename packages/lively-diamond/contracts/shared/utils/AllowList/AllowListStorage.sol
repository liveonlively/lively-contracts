// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { EnumerableSet } from "@solidstate/contracts/data/EnumerableSet.sol";
import { OwnableStorage } from "@solidstate/contracts/access/ownable/OwnableStorage.sol";

library AllowListStorage {
    string private constant CONTRACT_VERSION = "0.0.1";

    using EnumerableSet for EnumerableSet.AddressSet;
    /**
     * @dev Before protocal publication we can remove these deprecated items but for upgradeability we need to keep them
     */
    struct Layout {
        mapping(uint256 => bool) allowListEnabled;
        mapping(uint256 => EnumerableSet.AddressSet) allowList;
        mapping(uint256 => mapping(address => uint256)) allowance;
        mapping(uint256 => mapping(address => uint256)) allowTime;
        mapping(uint256 => mapping(address => uint256)) minted;
        // mapping(uint256 => AllowListStruct) allowLists; // Mapping between tokenId and allowList
    }

    bytes32 internal constant STORAGE_SLOT = keccak256("lively.contracts.storage.AllowList");

    function layout() internal pure returns (Layout storage l) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            l.slot := slot
        }
    }
}
