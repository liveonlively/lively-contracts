// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { AllowList, AllowListStorage } from "../utils/AllowList/AllowList.sol";
import { EnumerableSet } from "@solidstate/contracts/data/EnumerableSet.sol";

contract AllowListFacet is AllowList {
    string private constant CONTRACT_VERSION = "0.0.1";

    using AllowListStorage for AllowListStorage.Layout;
    using EnumerableSet for EnumerableSet.AddressSet;

    struct AllowListMap {
        address account;
        uint256 allowance;
    }

    /// 721's can use tokenId 0
    function allowListEnabled(uint256 _tokenId) external view returns (bool enabled) {
        enabled = AllowListStorage.layout().allowListEnabled[_tokenId];
    }

    /// 721's can use tokenId 0
    function enableAllowList(uint256 _tokenId) external onlyOwner {
        _enableAllowList(_tokenId);
    }

    /// 721's can use tokenId 0
    function disableAllowList(uint256 _tokenId) external onlyOwner {
        _disableAllowList(_tokenId);
    }

    /// 721's can use tokenId 0
    function allowList(uint256 _tokenId) external view returns (AllowListMap[] memory allowListMap) {
        AllowListStorage.Layout storage als = AllowListStorage.layout();
        uint256 allowListLength = als.allowList[_tokenId].length();
        allowListMap = new AllowListMap[](allowListLength);
        uint256 i = 0;
        for (; i < allowListLength; ) {
            address addressAtIndex = als.allowList[_tokenId].at(i);
            allowListMap[i].account = addressAtIndex;
            allowListMap[i].allowance = als.allowance[_tokenId][addressAtIndex];
            ++i;
        }
    }
}
