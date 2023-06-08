// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.18;

import { IERC20 } from "@solidstate/contracts/interfaces/IERC20.sol";

contract USDCMock is IERC20 {
    string private constant CONTRACT_VERSION = "0.0.1";

    function name() external view returns (string memory) {}

    function symbol() external view returns (string memory) {}

    function decimals() external view returns (uint8) {}

    function totalSupply() external view override returns (uint256) {}

    function balanceOf(address owner) external view override returns (uint256) {}

    function allowance(address owner, address spender) external view override returns (uint256) {}

    function approve(address spender, uint256 value) external override returns (bool) {}

    function transfer(address to, uint256 value) external override returns (bool) {}

    function transferFrom(address from, address to, uint256 value) external override returns (bool) {}
}
