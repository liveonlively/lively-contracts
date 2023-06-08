# Solidity API

## PaymentSplitterInternal

### _totalShares

```solidity
function _totalShares() internal view returns (uint256 totalShares)
```

_Getter for the total shares held by payees._

### _totalReleased

```solidity
function _totalReleased() internal view returns (uint256 totalReleased)
```

_Getter for the total amount of Ether already released._

### _totalReleased

```solidity
function _totalReleased(contract IERC20 token) internal view returns (uint256 result)
```

_Getter for the total amount of `token` already released. `token` should be the address of an IERC20
contract._

### _shares

```solidity
function _shares(address account) internal view returns (uint256 shares)
```

_Getter for the amount of shares held by an account._

### _released

```solidity
function _released(address account) internal view returns (uint256 releasedAmount)
```

_Getter for the amount of Ether already released to a payee._

### _released

```solidity
function _released(contract IERC20 token, address account) internal view returns (uint256 releasedAmount)
```

_Getter for the amount of `token` tokens already released to a payee. `token` should be the address of an
IERC20 contract._

### _payee

```solidity
function _payee(uint256 index) internal view returns (address payeeAddress)
```

_Getter for the address of the payee number `index`._

### _releasable

```solidity
function _releasable(address account) internal view returns (uint256 releasable)
```

_Getter for the amount of payee's releasable Ether._

### _releasable

```solidity
function _releasable(contract IERC20 token, address account) internal view returns (uint256 releasable)
```

_Getter for the amount of payee's releasable `token` tokens. `token` should be the address of an
IERC20 contract._

### _release

```solidity
function _release(address payable account) internal virtual
```

_Triggers a transfer to `account` of the amount of Ether they are owed, according to their percentage of the
total shares and their previous withdrawals._

### _release

```solidity
function _release(contract IERC20 token, address account) internal virtual
```

_Triggers a transfer to `account` of the amount of `token` tokens they are owed, according to their
percentage of the total shares and their previous withdrawals. `token` must be the address of an IERC20
contract._

### _pendingPayment

```solidity
function _pendingPayment(address account, uint256 totalReceived, uint256 alreadyReleased) internal view returns (uint256 pendingPayment)
```

_internal logic for computing the pending payment of an `account` given the token historical balances and
already released amounts._

### _addPayee

```solidity
function _addPayee(address account, uint256 shares_) internal
```

_Add a new payee to the contract._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | The address of the payee to add. |
| shares_ | uint256 | The number of shares owned by the payee. |

