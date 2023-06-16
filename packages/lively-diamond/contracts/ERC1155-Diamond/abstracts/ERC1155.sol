// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { IERC1155Facet } from "../interfaces/IERC1155Facet.sol";
import { ERC1155Storage } from "../utils/ERC1155/ERC1155Storage.sol";
import { ERC1155Lib } from "../libraries/ERC1155Lib.sol";
import { PriceConsumer } from "../../shared/libraries/PriceConsumer.sol";
import { EnumerableSet } from "@solidstate/contracts/data/EnumerableSet.sol";
import { CoinSwapper } from "../../shared/libraries/CoinSwapper.sol";
import { PausableInternal } from "@solidstate/contracts/security/pausable/PausableInternal.sol";
import { ERC1155BaseStorage } from "@solidstate/contracts/token/ERC1155/base/ERC1155BaseStorage.sol";
import { IERC1155Metadata } from "@solidstate/contracts/token/ERC1155/metadata/IERC1155Metadata.sol";
import { ERC1155MetadataStorage } from "@solidstate/contracts/token/ERC1155/metadata/ERC1155MetadataStorage.sol";
import { ERC1155EnumerableStorage } from "@solidstate/contracts/token/ERC1155/enumerable/ERC1155EnumerableStorage.sol";
import { SolidStateERC1155 } from "@solidstate/contracts/token/ERC1155/SolidStateERC1155.sol";
import { ISolidStateERC20 } from "@solidstate/contracts/token/ERC20/ISolidStateERC20.sol";
import { AllowListStorage, AllowListInternal } from "../../shared/utils/AllowList/AllowListInternal.sol";
import { IERC1155Facet } from "../interfaces/IERC1155Facet.sol";
import { OwnableStorage } from "@solidstate/contracts/access/ownable/OwnableStorage.sol";

abstract contract ERC1155 is SolidStateERC1155, IERC1155Facet, PausableInternal, AllowListInternal {
    string private constant CONTRACT_VERSION = "0.0.1";

    using EnumerableSet for EnumerableSet.UintSet;
    using EnumerableSet for EnumerableSet.AddressSet;
    using ERC1155Storage for ERC1155Storage.Layout;
    using ERC1155EnumerableStorage for ERC1155EnumerableStorage.Layout;

    enum MintType {
        SINGLE,
        PACK,
        CROSSMINT_USDC_SINGLE,
        CROSSMINT_USDC_PACK
    }

    modifier validTokenID(uint256 _tokenId) {
        if (ERC1155Storage.layout().tokenData[_tokenId].creator == address(0)) revert InvalidTokenID();

        _;
    }

    modifier validQuantity(uint256 _id, uint256 _amount) {
        uint256 maxSupply = ERC1155Storage.layout().tokenData[_id].maxSupply;

        if (maxSupply > 0)
            if (totalSupply(_id) + _amount > maxSupply) revert ExceedsMaxSupply();

        _;
    }

    modifier validTime(uint256 _id, uint256 amount) {
        bool failCheck = true; // If this is false by the end, revert.
        uint256 _startTime = ERC1155Storage.layout().tokenData[_id].startTime;

        if (msg.sender == OwnableStorage.layout().owner || _startTime < block.timestamp) {
            // Ignore checks for owner, there is no start time (0 will always be
            // less than block.timestamp), or start time has passed.
            failCheck = false;
            _;
        } else if (AllowListStorage.layout().allowListEnabled[_id]) {
            AllowListStorage.Layout storage als = AllowListStorage.layout();
            // Only happens if the allow list is enabled and the main start time has not passed

            // Check is sender is even in the list
            if (!EnumerableSet.contains(als.allowList[_id], msg.sender)) {
                revert AccountNotAllowListed();
            }

            // Check if allow list start time has passed for this particular account
            if (block.timestamp > als.allowTime[_id][msg.sender]) revert AllowListMintUnopened();

            // Check if the amount being minted is less than or equal to the amount allowed
            if (amount >= als.minted[_id][msg.sender]) revert AllowListAmountExceeded();

            // Passed all checks for allow list
            failCheck = false;
            _;
        }

        // Not owner, time hasn't passed (after checking AllowList for it to continue)
        if (failCheck) revert MintNotOpen();
    }
}
