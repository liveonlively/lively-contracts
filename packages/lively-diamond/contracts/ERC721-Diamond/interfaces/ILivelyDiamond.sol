// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

abstract contract ILivelyDiamond {
    string private constant CONTRACT_VERSION = "0.0.1";

    error PaymentSplitterMismatch();
    error PaymentSplitterNoPayees();
}
