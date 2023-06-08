// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.18;

import {IERC20} from "@solidstate/contracts/interfaces/IERC20.sol";

interface IWETH9 is IERC20 {
    function deposit() external payable;

    function withdraw(uint256) external;
}
