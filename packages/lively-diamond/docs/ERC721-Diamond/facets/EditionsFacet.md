# ERC721-Diamond/facets/EditionsFacet.md

## EditionsFacet

Create editions for diamond ERC721A

### MAX_UINT256

```solidity
uint256 MAX_UINT256
```

### MAX_UINT64

```solidity
uint64 MAX_UINT64
```

### AlreadyMinted

```solidity
error AlreadyMinted()
```

### EditionsEnabled

```solidity
error EditionsEnabled()
```

### URIRequired

```solidity
error URIRequired()
```

### EditionSoldOut

```solidity
error EditionSoldOut()
```

### InsufficientValue

```solidity
error InsufficientValue()
```

### InvalidEditionId

```solidity
error InvalidEditionId()
```

### InvalidValueSent

```solidity
error InvalidValueSent()
```

### ExceedsMaxSupply

```solidity
error ExceedsMaxSupply()
```

### ExceedsMaxMintPerAddress

```solidity
error ExceedsMaxMintPerAddress()
```

### ExceedsMaxMintPerTx

```solidity
error ExceedsMaxMintPerTx()
```

### InvalidAirdropCaller

```solidity
error InvalidAirdropCaller()
```

### validEdition

```solidity
modifier validEdition(uint256 _editionIndex)
```

### createEdition

```solidity
function createEdition(string _name, uint256 _maxSupply, uint256 _price) public
```

### enableEditions

```solidity
function enableEditions() public
```

### mint

```solidity
function mint(address to, uint256 amount, uint256 editionIndex) public payable
```

### \_mintApproved

```solidity
function _mintApproved(address to, uint256 quantity) internal
```

### price

```solidity
function price(uint256 _editionIndex) public view returns (uint256)
```

### maxSupply

```solidity
function maxSupply(uint256 _editionIndex) public view returns (uint256)
```

### totalSupply

```solidity
function totalSupply(uint256 _editionIndex) public view returns (uint256)
```

### setPrice

```solidity
function setPrice(uint256 _price, uint256 _editionIndex) external
```

### setMaxSupply

```solidity
function setMaxSupply(uint256 _maxSupply, uint256 _editionIndex) external
```

### updateTotalSupply

```solidity
function updateTotalSupply(uint256 _totalSuppy, uint256 _editionIndex) public
```
