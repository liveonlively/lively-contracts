// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { LibDiamondEtherscan } from "../libraries/LibDiamondEtherscan.sol";
import { OwnableInternal } from "@solidstate/contracts/access/ownable/OwnableInternal.sol";

contract DiamondEtherscanFacet is OwnableInternal {
    string private constant CONTRACT_VERSION = "0.0.1";

    /// Allows owner to set new duummy implementation for EVM scanners.
    function setDummyImplementation(address _implementation) external onlyOwner {
        LibDiamondEtherscan._setDummyImplementation(_implementation);
    }

    /// Returns the implementation for EVM scanners.
    function implementation() external view returns (address) {
        return LibDiamondEtherscan._dummyImplementation();
    }
}
