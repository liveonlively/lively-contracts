# Solidity API

## PriceConsumer

### localId

```solidity
uint256 localId
```

### ethereumId

```solidity
uint256 ethereumId
```

### rinkebyId

```solidity
uint256 rinkebyId
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

### getPriceFeedAddress

```solidity
function getPriceFeedAddress() internal view returns (address priceFeedAddress)
```

### getLatestPrice

```solidity
function getLatestPrice() internal view returns (uint256)
```

Returns the latest price

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 | latest price |

### getPriceFeed

```solidity
function getPriceFeed() internal view returns (contract AggregatorV3Interface)
```

Returns the Price Feed address

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | contract AggregatorV3Interface | Price Feed address |

### convertUSDtoWei

```solidity
function convertUSDtoWei(uint256 _price) internal view returns (uint256)
```

