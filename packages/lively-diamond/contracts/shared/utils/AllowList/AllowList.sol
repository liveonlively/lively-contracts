// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { AllowListStorage } from "./AllowListStorage.sol";
import { AllowListInternal } from "./AllowListInternal.sol";
import { OwnableInternal } from "@solidstate/contracts/access/ownable/Ownable.sol";
import { EnumerableSet } from "@solidstate/contracts/data/EnumerableSet.sol";

contract AllowList is AllowListInternal, OwnableInternal {
    string private constant CONTRACT_VERSION = "0.0.1";

    using AllowListStorage for AllowListStorage.Layout;

    function _enableAllowList(uint256 tokenId) internal {
        AllowListStorage.Layout storage als = AllowListStorage.layout();

        if (als.allowListEnabled[tokenId]) revert AllowListEnabled();

        als.allowListEnabled[tokenId] = true;

        emit AllowListStatus(tokenId, true);
    }

    function _disableAllowList(uint256 tokenId) internal {
        AllowListStorage.Layout storage als = AllowListStorage.layout();

        if (!als.allowListEnabled[tokenId]) revert AllowListEnabled();

        als.allowListEnabled[tokenId] = false;

        emit AllowListStatus(tokenId, false);
    }

    function addToAllowList(uint256 tokenId, address account) external onlyOwner {
        _addToAllowList(tokenId, account, 0, 0);
    }

    function addToAllowList(uint256 tokenId, address account, uint256 allowance) external onlyOwner {
        _addToAllowList(tokenId, account, allowance, 0);
    }

    function addToAllowList(uint256 tokenId, address account, uint256 allowance, uint256 allowTime) external onlyOwner {
        _addToAllowList(tokenId, account, allowance, allowTime);
    }

    function addToAllowList(uint256 tokenId, address[] calldata accounts) external onlyOwner {
        _addToAllowList(tokenId, accounts, 0, 0);
    }

    function addToAllowList(uint256 tokenId, address[] calldata accounts, uint256 allowance) external onlyOwner {
        _addToAllowList(tokenId, accounts, allowance, 0);
    }

    function addToAllowList(
        uint256 tokenId,
        address[] calldata accounts,
        uint256 allowance,
        uint256 allowTime
    ) external onlyOwner {
        _addToAllowList(tokenId, accounts, allowance, allowTime);
    }

    function removeFromAllowList(uint256 tokenId, address account) external onlyOwner {
        _removeFromAllowList(tokenId, account);
    }

    function removeFromAllowList(uint256 tokenId, address[] calldata accounts) external onlyOwner {
        _removeFromAllowList(tokenId, accounts);
    }

    function allowListContains(uint256 tokenId, address account) external view returns (bool contains) {
        return _allowListContains(tokenId, account);
    }
}
