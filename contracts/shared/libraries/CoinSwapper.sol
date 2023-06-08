// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { LibDiamond } from "./LibDiamond.sol";
import { IWETH9 } from "../interfaces/IWETH9.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

library CoinSwapper {
    string private constant CONTRACT_VERSION = "0.0.1";

    uint256 constant localId = 31337;
    uint256 constant ethereumId = 1;
    uint256 constant goerliId = 5;
    uint256 constant polygonId = 137;
    uint256 constant mumbaiId = 80001;

    ISwapRouter public constant swapRouter = ISwapRouter(0xE592427A0AEce92De3Edee1F18E0157C05861564); // Same on all Nets SwapRouter address

    // Returns the appropriate WETH9 token address for the given network id.
    function getWETH9Address() internal view returns (address priceFeedAddress) {
        if (block.chainid == ethereumId || block.chainid == localId) {
            return 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
        } else if (block.chainid == polygonId) {
            return 0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619;
        } else if (block.chainid == goerliId) {
            return 0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6;
        } else if (block.chainid == mumbaiId) {
            return 0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa;
        }
    }

    // Returns the appropriate USDC token address for the given network id.
    function getUSDCAddress() internal view returns (address priceFeedAddress) {
        if (block.chainid == ethereumId || block.chainid == localId) {
            return 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
        } else if (block.chainid == polygonId) {
            return 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174;
        } else if (block.chainid == goerliId) {
            return 0x98339D8C260052B7ad81c28c16C0b98420f2B46a;
        } else if (block.chainid == mumbaiId) {
            return 0xFEca406dA9727A25E71e732F9961F680059eF1F9;
        }
    }

    /** @dev Shortcut function to swap ETH for USDC */
    function convertEthToUSDC() internal {
        wrapMsgEth();
        convertWETHtoUSDC();
    }

    /** @dev Wraps the entire balance of the contract in WETH9 */
    function wrapEth() internal {
        address WETH9 = getWETH9Address();
        IWETH9(WETH9).deposit{ value: address(this).balance }();
    }

    /** @dev Wraps the entire balance of the contract in WETH9 */
    function wrapMsgEth() internal {
        address WETH9 = getWETH9Address();
        IWETH9(WETH9).deposit{ value: msg.value }();
    }

    /** @dev Converts all WETH owned by contract to USDC */
    function convertWETHtoUSDC() internal {
        address USDC = getUSDCAddress();
        address WETH9 = getWETH9Address();
        uint256 currentBlance = IWETH9(WETH9).balanceOf(address(this));

        // For this example, we will set the pool fee to 0.3%.
        uint24 poolFee = 3000;

        TransferHelper.safeTransferFrom(WETH9, address(this), address(this), currentBlance);

        TransferHelper.safeApprove(WETH9, address(swapRouter), currentBlance);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams({
            tokenIn: WETH9,
            tokenOut: USDC,
            fee: poolFee,
            recipient: address(this),
            deadline: block.timestamp,
            amountIn: currentBlance,
            amountOutMinimum: 0,
            sqrtPriceLimitX96: 0
        });

        swapRouter.exactInputSingle(params);
    }
}
