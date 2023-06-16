# ERC1155-Diamond/libraries/ERC1155Lib.md

## ERC1155Lib

### ArrayLengthsDiffer

```solidity
error ArrayLengthsDiffer()
```

### NotOwner

```solidity
error NotOwner()
```

### URI

```solidity
event URI(string _value, uint256 _id)
```

### create

```solidity
function create(struct ERC1155Storage.TokenStructure _tokenData) internal returns (uint256 _id)
```

_Creates a new token type NOTE: remove onlyOwner if you want third parties to create new tokens on your contract (which
may change your IDs)_

#### Parameters

| Name        | Type                                 | Description     |
| ----------- | ------------------------------------ | --------------- |
| \_tokenData | struct ERC1155Storage.TokenStructure | The token data. |

#### Return Values

| Name | Type    | Description                |
| ---- | ------- | -------------------------- |
| \_id | uint256 | The newly created token ID |

### batchCreate

```solidity
function batchCreate(uint256 _amount, struct ERC1155Storage.TokenStructure _tokenData) internal returns (bool success)
```

_Creates a new token types in batch (with different settings) NOTE: remove onlyOwner if you want third parties to create
new tokens on your contract (which may change your IDs)_

#### Parameters

| Name        | Type                                 | Description                                        |
| ----------- | ------------------------------------ | -------------------------------------------------- |
| \_amount    | uint256                              | Amount of new token to create with these settings. |
| \_tokenData | struct ERC1155Storage.TokenStructure | The token data.                                    |

#### Return Values

| Name    | Type | Description     |
| ------- | ---- | --------------- |
| success | bool | Bool of success |

### batchCreate

```solidity
function batchCreate(struct ERC1155Storage.TokenStructure[] _tokenData) internal returns (bool success)
```

_Creates a new token types in batch NOTE: remove onlyOwner if you want third parties to create new tokens on your
contract (which may change your IDs)_

#### Parameters

| Name        | Type                                   | Description     |
| ----------- | -------------------------------------- | --------------- |
| \_tokenData | struct ERC1155Storage.TokenStructure[] | The token data. |

#### Return Values

| Name    | Type | Description                                |
| ------- | ---- | ------------------------------------------ |
| success | bool | True if the batch creation was successful. |

### \_incrementTokenTypeId

```solidity
function _incrementTokenTypeId() internal
```
