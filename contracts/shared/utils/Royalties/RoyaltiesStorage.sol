// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

library RoyaltiesStorage {
    struct Layout {
        string contractURI;
    }

    bytes32 internal constant STORAGE_SLOT = keccak256("lively.contracts.storage.Royalties");

    function layout() internal pure returns (Layout storage l) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            l.slot := slot
        }
    }
}
