// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { Pausable } from "@solidstate/contracts/security/pausable/Pausable.sol";
import { OwnableInternal } from "@solidstate/contracts/access/ownable/OwnableInternal.sol";

contract PausableFacet is Pausable, OwnableInternal {
    string private constant CONTRACT_VERSION = "0.0.1";

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }
}
