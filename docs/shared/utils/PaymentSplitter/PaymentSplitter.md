# Solidity API

## PaymentSplitter

### totalShares

```solidity
function totalShares() public view virtual returns (uint256)
```

### totalReleased

```solidity
function totalReleased() public view virtual returns (uint256)
```

### totalReleased

```solidity
function totalReleased(contract IERC20 token) public view virtual returns (uint256)
```

### shares

```solidity
function shares(address account) public view virtual returns (uint256)
```

### released

```solidity
function released(address account) public view virtual returns (uint256)
```

### released

```solidity
function released(contract IERC20 token, address account) public view virtual returns (uint256)
```

### payee

```solidity
function payee(uint256 index) public view virtual returns (address)
```

### releasable

```solidity
function releasable(address account) public view virtual returns (uint256)
```

### releasable

```solidity
function releasable(contract IERC20 token, address account) public view virtual returns (uint256)
```

### release

```solidity
function release(address payable account) public virtual
```

### release

```solidity
function release(contract IERC20 token, address account) public virtual
```

### addPayee

```solidity
function addPayee(address account, uint256 shares_) public virtual
```

