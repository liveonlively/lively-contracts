// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

library PaymentSplitterStorage {
    string private constant CONTRACT_VERSION = "0.0.1";

    struct Layout {
        uint256 totalShares;
        uint256 totalReleased;
        mapping(address => uint256) shares;
        mapping(address => uint256) released;
        address[] payees;
        mapping(IERC20 => uint256) erc20TotalReleased;
        mapping(IERC20 => mapping(address => uint256)) erc20Released;
        bool isPriceUSD; // NOTE: I took this out for some reason earlier. Maybe there's a better place to put this?
        bool automaticUSDConversion;
    }

    bytes32 internal constant STORAGE_SLOT = keccak256("lively.contracts.storage.PaymentSplitter");

    function layout() internal pure returns (Layout storage l) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            l.slot := slot
        }
    }
}
