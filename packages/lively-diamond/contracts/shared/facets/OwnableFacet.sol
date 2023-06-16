// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { Ownable } from "@solidstate/contracts/access/ownable/Ownable.sol";
import { OwnableStorage } from "@solidstate/contracts/access/ownable/OwnableStorage.sol";

contract OwnableFacet is Ownable {
    string private constant CONTRACT_VERSION = "0.0.1";

    using OwnableStorage for OwnableStorage.Layout;

    function __transitiveOwner() external view returns (address) {
        return _transitiveOwner();
    }
}
