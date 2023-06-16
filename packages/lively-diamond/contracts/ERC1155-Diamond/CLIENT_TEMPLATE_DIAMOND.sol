// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { IDiamondCut } from "../shared/interfaces/IDiamondCut.sol";
import { Lively1155Diamond } from "./Lively1155Diamond.sol";

/// @custom:security-contact support@golive.ly
contract CLIENT_TEMPLATE_DIAMOND is Lively1155Diamond {
    string private constant CONTRACT_VERSION = "0.0.1";

    constructor(
        IDiamondCut.FacetCut[] memory _diamondCut,
        address _init,
        bytes memory _calldata
    ) payable Lively1155Diamond(_diamondCut, _init, _calldata) {}
}
