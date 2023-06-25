# shared/utils/PaymentSplitter/PaymentSplitter.md

## PaymentSplitter

### totalShares

```solidity
function totalShares() external view virtual returns (uint256)
```

### totalReleased

```solidity
function totalReleased() external view virtual returns (uint256)
```

### totalReleased

```solidity
function totalReleased(contract IERC20 token) external view virtual returns (uint256)
```

### shares

```solidity
function shares(address account) external view virtual returns (uint256)
```

### released

```solidity
function released(address account) external view virtual returns (uint256)
```

### released

```solidity
function released(contract IERC20 token, address account) external view virtual returns (uint256)
```

### payee

```solidity
function payee(uint256 index) external view virtual returns (address)
```

### releasable

```solidity
function releasable(address account) external view virtual returns (uint256)
```

### releasable

```solidity
function releasable(contract IERC20 token, address account) external view virtual returns (uint256)
```

### release

```solidity
function release(address payable account) external virtual
```

### release

```solidity
function release(contract IERC20 token, address account) external virtual
```

### addPayee

```solidity
function addPayee(address account, uint256 shares_) external virtual
```

### isPriceUSD

```solidity
function isPriceUSD() external view virtual returns (bool)
```

### automaticUSDConversion

```solidity
function automaticUSDConversion() external view virtual returns (bool)
```
