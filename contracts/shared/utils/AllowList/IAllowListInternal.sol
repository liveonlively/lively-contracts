// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IAllowListInternal {
    error AccountNotAllowListed();
    error AccountAlreadyAllowListed();
    error AllowListEnabled();
    error AllowListDisabled();
    error MintNotOpen();
    error NotOnAllowList();
    error AllowListAmountExceeded();
    error AllowListMintUnopened();

    event AllowListStatus(bool status);
    event AllowListAdded(address account, uint256 allowance);
    event AllowListAdded(address[] accounts, uint256 allowance);
    event AllowListRemoved(address account);
    event AllowListRemoved(address[] accounts);

    event AllowListStatus(uint256 tokenId, bool status);
    event AllowListAdded(uint256 tokenId, address account, uint256 allowance);
    event AllowListAdded(uint256 tokenId, address[] accounts, uint256 allowance);
    event AllowListRemoved(uint256 tokenId, address account);
    event AllowListRemoved(uint256 tokenId, address[] accounts);
}
