// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { AllowListStorage } from "./AllowListStorage.sol";
import { IAllowListInternal } from "./IAllowListInternal.sol";
import { EnumerableSet } from "@solidstate/contracts/data/EnumerableSet.sol";

contract AllowListInternal is IAllowListInternal {
    string private constant CONTRACT_VERSION = "0.0.1";

    // using AllowListStorage for AllowListStorage.Layout;
    using EnumerableSet for EnumerableSet.AddressSet;

    modifier allowListed(uint256 tokenId, address account) {
        if (!AllowListStorage.layout().allowList[tokenId].contains(account)) {
            revert AccountNotAllowListed();
        }

        _;
    }

    function isAllowListed(uint256 tokenId, address account) internal view returns (bool) {
        return AllowListStorage.layout().allowList[tokenId].contains(account);
    }

    function _allowListAllowance(
        uint256 tokenId,
        address account
    ) internal view allowListed(tokenId, account) returns (uint256) {
        return AllowListStorage.layout().allowance[tokenId][account];
    }

    function _addToAllowList(uint256 tokenId, address _account, uint256 _allowance, uint256 _allowTime) internal {
        // If the account is already in the allowList, we don't want to add it again.
        AllowListStorage.Layout storage als = AllowListStorage.layout();

        if (als.allowList[tokenId].contains(_account)) {
            revert AccountAlreadyAllowListed();
        }

        als.allowList[tokenId].add(_account);
        als.allowance[tokenId][_account] = _allowance;
        als.allowTime[tokenId][_account] = _allowTime;

        emit AllowListAdded(tokenId, _account, _allowance);
    }

    function _addToAllowList(uint256 tokenId, address[] calldata _accounts, uint256 _allowance) internal {
        AllowListStorage.Layout storage als = AllowListStorage.layout();

        uint256 accountsLength = _accounts.length;
        uint256 i = 0;
        for (; i < accountsLength; ) {
            if (als.allowList[tokenId].contains(_accounts[i])) {
                revert AccountAlreadyAllowListed();
            }
            als.allowList[tokenId].add(_accounts[i]);
            als.allowance[tokenId][_accounts[i]] = _allowance;
            ++i;
        }

        emit AllowListAdded(tokenId, _accounts, _allowance);
    }

    function _addToAllowList(
        uint256 tokenId,
        address[] calldata _accounts,
        uint256 _allowance,
        uint256 _allowTime
    ) internal {
        AllowListStorage.Layout storage als = AllowListStorage.layout();
        uint256 accountsLength = _accounts.length;
        uint256 i = 0;
        for (; i < accountsLength; ) {
            if (als.allowList[tokenId].contains(_accounts[i])) {
                revert AccountAlreadyAllowListed();
            }
            als.allowList[tokenId].add(_accounts[i]);
            als.allowance[tokenId][_accounts[i]] = _allowance;
            als.allowTime[tokenId][_accounts[i]] = _allowTime;
            ++i;
        }

        emit AllowListAdded(tokenId, _accounts, _allowance);
    }

    function _removeFromAllowList(uint256 tokenId, address _account) internal {
        AllowListStorage.Layout storage als = AllowListStorage.layout();

        if (!als.allowList[tokenId].contains(_account)) {
            revert AccountNotAllowListed();
        }

        als.allowList[tokenId].remove(_account);
        delete als.allowance[tokenId][_account];

        emit AllowListRemoved(tokenId, _account);
    }

    function _removeFromAllowList(uint256 tokenId, address[] calldata _accounts) internal {
        AllowListStorage.Layout storage als = AllowListStorage.layout();

        uint256 accountsLength = _accounts.length;
        uint256 i = 0;
        for (; i < accountsLength; ) {
            if (!als.allowList[tokenId].contains(_accounts[i])) {
                revert AccountNotAllowListed();
            }

            als.allowList[tokenId].remove(_accounts[i]);
            delete als.allowance[tokenId][_accounts[i]];
            ++i;
        }

        emit AllowListRemoved(tokenId, _accounts);
    }

    function _allowListContains(uint256 tokenId, address _account) internal view returns (bool) {
        return AllowListStorage.layout().allowList[tokenId].contains(_account);
    }
}
