# ERC721-Diamond/facets/ERC721AFacet.md

## ERC721AFacet

\_Implementation of the [ERC721](https://eips.ethereum.org/EIPS/eip-721) Non-Fungible Token Standard, including the
Metadata extension. Optimized for lower gas during batch mints.

Token IDs are minted in sequential order (e.g. 0, 1, 2, 3, ...) starting from `_startTokenId()`.

Assumptions:

- An owner cannot have more than 2\*\*64 - 1 (max value of uint64) of supply.
- The maximum token ID cannot exceed 2\*\*256 - 1 (max value of uint256).\_

### MAX_UINT256

```solidity
uint256 MAX_UINT256
```

### MAX_UINT64

```solidity
uint64 MAX_UINT64
```

### mintChecks

```solidity
modifier mintChecks(address to)
```

### mint

```solidity
function mint(address to) external payable
```

### mint

```solidity
function mint(address to, uint256 amount) external payable
```

### \_mintApproved

```solidity
function _mintApproved(address to, uint256 amount) internal
```

### airdrop

```solidity
function airdrop() public view returns (bool)
```

### maxMintPerTx

```solidity
function maxMintPerTx() public view returns (uint256)
```

### maxMintPerAddress

```solidity
function maxMintPerAddress() public view returns (uint256)
```

### maxSupply

```solidity
function maxSupply() public view returns (uint256)
```

### price

```solidity
function price() public view returns (uint256)
```

### isSoulbound

```solidity
function isSoulbound() external view returns (bool)
```

### setName

```solidity
function setName(string _name) external
```

### setSymbol

```solidity
function setSymbol(string _symbol) external
```

### setTokenURI

```solidity
function setTokenURI(string tokenURI) external
```

### setPrice

```solidity
function setPrice(uint256 _price) external
```

### setAirdrop

```solidity
function setAirdrop(bool _airdrop) external
```

### setMaxMintPerTx

```solidity
function setMaxMintPerTx(uint256 _maxMintPerTx) external
```

### setMaxMintPerAddress

```solidity
function setMaxMintPerAddress(uint256 _maxMintPerAddress) external
```

### setMaxSupply

```solidity
function setMaxSupply(uint256 _maxSupply) external
```

### setIsPriceUSD

```solidity
function setIsPriceUSD(bool _isPriceUSD) external
```

### setAutomaticUSDConversion

```solidity
function setAutomaticUSDConversion(bool _automaticUSDConversion) external
```

### setSoulbound

```solidity
function setSoulbound(bool _isSoulbound) external
```

### burn

```solidity
function burn(uint256 tokenId) public
```
