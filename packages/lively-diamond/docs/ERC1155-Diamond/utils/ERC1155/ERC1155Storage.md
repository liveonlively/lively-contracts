# ERC1155-Diamond/utils/ERC1155/ERC1155Storage.md

## ERC1155Storage

### TokenStructure

```solidity
struct TokenStructure {
  uint256 maxSupply;
  uint256 price;
  address creator;
  string tokenUri;
  bool allowListEnabled;
  uint256 startTime;
  bool isCrossmintUSDC;
}
```

### PackStructure

```solidity
struct PackStructure {
  uint256 price;
  uint256 startTime;
  uint256[] tokenIds;
}
```

### Layout

```solidity
struct Layout {
  uint256 currentTokenId;
  bool airdrop;
  string name;
  string symbol;
  string contractURI;
  mapping(uint256 => uint256) maxSupply;
  mapping(uint256 => uint256) price;
  mapping(uint256 => address) creator;
  mapping(uint256 => string) tokenUri;
  mapping(uint256 => bool) allowListEnabled;
  mapping(uint256 => struct ERC1155Storage.TokenStructure) tokenData;
  bool isPriceUSD;
  bool automaticUSDConversion;
  uint256 currentPackId;
  mapping(uint256 => struct ERC1155Storage.PackStructure) packData;
}
```

### STORAGE_SLOT

```solidity
bytes32 STORAGE_SLOT
```

### layout

```solidity
function layout() internal pure returns (struct ERC1155Storage.Layout l)
```

### tokenData

```solidity
function tokenData(uint256 _tokenId) internal view returns (struct ERC1155Storage.TokenStructure)
```

### packData

```solidity
function packData(uint256 _packId) internal view returns (struct ERC1155Storage.PackStructure)
```

### incrementPackId

```solidity
function incrementPackId(struct ERC1155Storage.Layout l) internal
```

### getCurrentPackId

```solidity
function getCurrentPackId(struct ERC1155Storage.Layout l) internal view returns (uint256)
```
