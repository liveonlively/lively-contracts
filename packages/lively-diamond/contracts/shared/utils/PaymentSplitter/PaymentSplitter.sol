// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { PaymentSplitterStorage } from ".//PaymentSplitterStorage.sol";
import { PaymentSplitterInternal } from "./PaymentSplitterInternal.sol";
import { OwnableInternal } from "@solidstate/contracts/access/ownable/Ownable.sol";

abstract contract PaymentSplitter is PaymentSplitterInternal, OwnableInternal {
    string private constant CONTRACT_VERSION = "0.0.1";

    function totalShares() external view virtual returns (uint256) {
        return _totalShares();
    }

    function totalReleased() external view virtual returns (uint256) {
        return _totalReleased();
    }

    function totalReleased(IERC20 token) external view virtual returns (uint256) {
        return _totalReleased(token);
    }

    function shares(address account) external view virtual returns (uint256) {
        return _shares(account);
    }

    function released(address account) external view virtual returns (uint256) {
        return _released(account);
    }

    function released(IERC20 token, address account) external view virtual returns (uint256) {
        return _released(token, account);
    }

    function payee(uint256 index) external view virtual returns (address) {
        return _payee(index);
    }

    function releasable(address account) external view virtual returns (uint256) {
        return _releasable(account);
    }

    function releasable(IERC20 token, address account) external view virtual returns (uint256) {
        return _releasable(token, account);
    }

    function release(address payable account) external virtual {
        return _release(account);
    }

    function release(IERC20 token, address account) external virtual {
        return _release(token, account);
    }

    function addPayee(address account, uint256 shares_) external virtual onlyOwner {
        return _addPayee(account, shares_);
    }

    function isPriceUSD() external view virtual returns (bool) {
        return _isPriceUSD();
    }

    function automaticUSDConversion() external view virtual returns (bool) {
        return _automaticUSDConversion();
    }
}
