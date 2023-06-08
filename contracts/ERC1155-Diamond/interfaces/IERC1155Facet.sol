// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

abstract contract IERC1155Facet {
    string private constant CONTRACT_VERSION = "0.0.1";

    error ExceedsMaxSupply();
    error InvalidTokenID();
    error InvalidAmount();
    error InvalidMaxSupply();
    error ArrayLengthsDiffer();
    error InvalidMintType();

    event PaymentReceived(address from, uint256 amount);
}
