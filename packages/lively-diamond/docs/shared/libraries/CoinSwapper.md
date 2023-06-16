# shared/libraries/CoinSwapper.md

## CoinSwapper

### localId

```solidity
uint256 localId
```

### ethereumId

```solidity
uint256 ethereumId
```

### goerliId

```solidity
uint256 goerliId
```

### polygonId

```solidity
uint256 polygonId
```

### mumbaiId

```solidity
uint256 mumbaiId
```

### swapRouter

```solidity
contract ISwapRouter swapRouter
```

### getWETH9Address

```solidity
function getWETH9Address() internal view returns (address priceFeedAddress)
```

### getUSDCAddress

```solidity
function getUSDCAddress() internal view returns (address priceFeedAddress)
```

### convertEthToUSDC

```solidity
function convertEthToUSDC() internal
```

_Shortcut function to swap ETH for USDC_

### wrapEth

```solidity
function wrapEth() internal
```

_Wraps the entire balance of the contract in WETH9_

### wrapMsgEth

```solidity
function wrapMsgEth() internal
```

_Wraps the entire balance of the contract in WETH9_

### convertWETHtoUSDC

```solidity
function convertWETHtoUSDC() internal
```

_Converts all WETH owned by contract to USDC_
