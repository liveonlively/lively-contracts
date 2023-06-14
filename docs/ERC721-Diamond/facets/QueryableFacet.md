# ERC721-Diamond/facets/QueryableFacet.md

## QueryableFacet

_Queryable facet for Lively diamond contracs._

### getEditionIndex

```solidity
function getEditionIndex(uint256 _tokenId) external view returns (uint256)
```

_Get the editionIndex or a given tokenId_

#### Parameters

| Name      | Type    | Description          |
| --------- | ------- | -------------------- |
| \_tokenId | uint256 | The tokenId to check |

#### Return Values

| Name | Type    | Description      |
| ---- | ------- | ---------------- |
| [0]  | uint256 | The editionIndex |

### getOwners

```solidity
function getOwners() external view returns (address[])
```

_Get all the current owners of the collection_

#### Return Values

| Name | Type      | Description        |
| ---- | --------- | ------------------ |
| [0]  | address[] | Array of addresses |

### getOwners

```solidity
function getOwners(uint256 _editionIndex) external view returns (address[])
```

_Get all current owners of a specific edition in the collection_

#### Parameters

| Name           | Type    | Description                |
| -------------- | ------- | -------------------------- |
| \_editionIndex | uint256 | The edition index to check |

#### Return Values

| Name | Type      | Description        |
| ---- | --------- | ------------------ |
| [0]  | address[] | Array of addresses |

### getTokensByOwner

```solidity
function getTokensByOwner(address _owner) external view returns (uint256[])
```

_Get all tokens owned by a given address_

#### Parameters

| Name    | Type    | Description          |
| ------- | ------- | -------------------- |
| \_owner | address | Address of the owner |

#### Return Values

| Name | Type      | Description        |
| ---- | --------- | ------------------ |
| [0]  | uint256[] | Array of token IDs |

### getTokensByOwner

```solidity
function getTokensByOwner(address _owner, uint256 _editionIndex) public view returns (uint256[])
```

_Get all tokens owned by given address for a specific edition_

#### Parameters

| Name           | Type    | Description          |
| -------------- | ------- | -------------------- |
| \_owner        | address | Address of the owner |
| \_editionIndex | uint256 | Edition index        |

#### Return Values

| Name | Type      | Description        |
| ---- | --------- | ------------------ |
| [0]  | uint256[] | Array of token IDs |

### getEditionsByOwner

```solidity
function getEditionsByOwner(address _owner) external view returns (uint256[])
```

_Get all editions owned by a specific address_

#### Parameters

| Name    | Type    | Description          |
| ------- | ------- | -------------------- |
| \_owner | address | Address of the owner |

#### Return Values

| Name | Type      | Description              |
| ---- | --------- | ------------------------ |
| [0]  | uint256[] | Array of edition indexes |

### ownsEdition

```solidity
function ownsEdition(address _owner, uint256 editionIndex) external view returns (bool)
```

Verifies if address owns an edition

#### Parameters

| Name         | Type    | Description          |
| ------------ | ------- | -------------------- |
| \_owner      | address | Address of the owner |
| editionIndex | uint256 |                      |

#### Return Values

| Name | Type | Description                   |
| ---- | ---- | ----------------------------- |
| [0]  | bool | True/false based on ownership |
