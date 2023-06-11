// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {IDiamondCut} from "../shared/interfaces/IDiamondCut.sol";
import {LivelyDiamond} from "./LivelyDiamond.sol";

/// @custom:security-contact support@golive.ly
contract CLIENT_TEMPLATE_DIAMOND is LivelyDiamond {
    string private constant CONTRACT_VERSION = "0.0.1";

    constructor(
        IDiamondCut.FacetCut[] memory _diamondCut,
        LivelyDiamond.DiamondArgs memory _args
    ) payable LivelyDiamond(_diamondCut, _args) {}
}
