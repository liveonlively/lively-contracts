# ERC721-Diamond/libraries/Shared.md

## Shared

### PayeeAdded

```solidity
event PayeeAdded(address account, uint256 shares)
```

### PaymentReceived

```solidity
event PaymentReceived(address from, uint256 amount)
```

### RoleGranted

```solidity
event RoleGranted(bytes32 role, address account, address sender)
```

### EditionCreate

```solidity
event EditionCreate(uint256 editionIndex, string name, uint256 price, uint256 maxSupply)
```

### PaymentSplitterAccountAddressZero

```solidity
error PaymentSplitterAccountAddressZero()
```

### PaymentSplitterSharesZero

```solidity
error PaymentSplitterSharesZero()
```

### PaymentSplitterAccountHasShares

```solidity
error PaymentSplitterAccountHasShares()
```

### EditionsDisabled

```solidity
error EditionsDisabled()
```

### NameRequired

```solidity
error NameRequired()
```

### \_addPayee

```solidity
function _addPayee(address account, uint256 _shares) internal
```

_Add a new payee to the contract._

#### Parameters

| Name     | Type    | Description                              |
| -------- | ------- | ---------------------------------------- |
| account  | address | The address of the payee to add.         |
| \_shares | uint256 | The number of shares owned by the payee. |

### createEdition

```solidity
function createEdition(string _name, uint256 _maxSupply, uint256 _price) internal
```
