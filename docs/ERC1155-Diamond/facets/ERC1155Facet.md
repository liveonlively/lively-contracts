# ERC1155-Diamond/facets/ERC1155Facet.md

## ERC1155Facet

### validValueSent

```solidity
modifier validValueSent(uint256 _id, uint256 _amount)
```

Checks if valid value was sent.
Checks if the amount sent is greater than or equal to the price of the token. If the sender is the owner, it will bypass this check allowing the owner to mint or airdrop for free.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _id | uint256 | The token ID |
| _amount | uint256 | The amount of tokens being minted |

### packMint

```solidity
function packMint(address account, uint256 packId, uint256 amount) public payable
```

Mint a batch of tokens.

### packCreate

```solidity
function packCreate(uint256[] _tokenIds, uint256 _price, uint256 _startTime) external
```

### packPrice

```solidity
function packPrice(uint256 _packId) external view returns (uint256)
```

Get price for a pack

### packStartTime

```solidity
function packStartTime(uint256 _packId) external view returns (uint256)
```

Get startTime for a pack

### packTokenIds

```solidity
function packTokenIds(uint256 _packId) external view returns (uint256[])
```

Get tokenIds for a pack

### mint

```solidity
function mint(address account, uint256 id, uint256 amount) external payable
```

### mint

```solidity
function mint(address[] accounts, uint256 id, uint256 amount) external
```

Mint function used by owner for airdrops.
Mints to multiple accounts at once, used by owner for airdrops.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| accounts | address[] | Array of accounts to send to. |
| id | uint256 | ID of token to airdrop. |
| amount | uint256 | The amount of tokens being minted to each account. |

### uri

```solidity
function uri(uint256 tokenId) public view returns (string)
```

### maxSupply

```solidity
function maxSupply(uint256 _id) public view returns (uint256)
```

### setMaxSupply

```solidity
function setMaxSupply(uint256 _id, uint256 _maxSupply) external
```

### create

```solidity
function create(struct ERC1155Storage.TokenStructure _tokenData) public returns (uint256 _id)
```

Creates a new token edition.

_remove onlyOwner if you want third parties to create new tokens on your contract (which may change your IDs)_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _tokenData | struct ERC1155Storage.TokenStructure | The token data |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| _id | uint256 | The newly created token ID |

### batchCreate

```solidity
function batchCreate(uint256 _amount, struct ERC1155Storage.TokenStructure _tokenData) external returns (bool success)
```

Creates a new token editions in one transaction. All editions will have the same settings.
If you need individual settings (diffrent URIs, prices, etc), use the other batchCreate function.

_remove onlyOwner if you want third parties to create new tokens on your contract (which may change your IDs)_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _amount | uint256 | Amount of new token to create with these settings. |
| _tokenData | struct ERC1155Storage.TokenStructure | The token data |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| success | bool | Whether or not the batch creation was successful. |

### batchCreate

```solidity
function batchCreate(struct ERC1155Storage.TokenStructure[] _tokenData) external returns (bool success)
```

Creates a set of new editions in one transaction.
Editions are passed as an array so this is useful if they require very different settings.
If they're all similar, using the other batchCreate function might be easier.

_remove onlyOwner if you want third parties to create new tokens on your contract (which may change your IDs)_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _tokenData | struct ERC1155Storage.TokenStructure[] | The token data |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| success | bool | Bool of success |

### exists

```solidity
function exists(uint256 _tokenId) external view returns (bool)
```

_Returns whether the specified token exists by checking to see if it has a creator_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _tokenId | uint256 | uint256 ID of the token to query the existence of |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | bool whether the token exists |

### _exists

```solidity
function _exists(uint256 _id) internal view returns (bool)
```

### burn

```solidity
function burn(address account, uint256 id, uint256 amount) external
```

### _beforeTokenTransfer

```solidity
function _beforeTokenTransfer(address operator, address from, address to, uint256[] ids, uint256[] amounts, bytes data) internal
```

_Pause beforeTransfer for security_

### setApprovalForAll

```solidity
function setApprovalForAll(address operator, bool status) public
```

OpenSea Compliance

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data) public
```

### safeBatchTransferFrom

```solidity
function safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] amounts, bytes data) public virtual
```

### _toString

```solidity
function _toString(uint256 value) internal pure virtual returns (string str)
```

_Converts a uint256 to its ASCII string decimal representation._

### price

```solidity
function price(uint256 _id) public view returns (uint256)
```

Get price for certain edition

### setPrice

```solidity
function setPrice(uint256 _id, uint256 _price) external
```

Set price for certain edition

### name

```solidity
function name() public view returns (string)
```

_Name/symbol needed for certain sites like OpenSea_

### symbol

```solidity
function symbol() public view returns (string)
```

### setName

```solidity
function setName(string _name) external
```

### setSymbol

```solidity
function setSymbol(string _symbol) external
```

### startTime

```solidity
function startTime(uint256 _id) external view returns (uint256)
```

Function to get the start time of a specific token

### setStartTime

```solidity
function setStartTime(uint256 _id, uint256 _startTime) external
```

Function to change the start time of a specific token

### tokenData

```solidity
function tokenData(uint256 id) external view returns (struct ERC1155Storage.TokenStructure)
```

Get tokenData

### setTokenData

```solidity
function setTokenData(uint256 _id, struct ERC1155Storage.TokenStructure _tokenData) external
```

Set tokenData

