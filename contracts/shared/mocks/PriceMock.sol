// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import {PriceConsumer} from "../libraries/PriceConsumer.sol";

contract PriceMock {
    string private constant CONTRACT_VERSION = "0.0.1";

    function getLatestPrice() public view returns (uint256) {
        return PriceConsumer.getLatestPrice();
    }

    function convertUSDtoWei(uint256 _price) public view returns (uint256) {
        /** 1e18 is equivalent to one eth in wei. 1e6 needed to convert price return to correct decimals (8).  */
        return (1e18 / (PriceConsumer.getLatestPrice() / 1e6)) * _price;
    }
}
