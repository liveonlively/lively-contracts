# ERC721-Diamond/utils/ERC721A/ERC721AStorage.md

## TokenApprovalRef

```solidity
struct TokenApprovalRef {
  address value;
}
```

## ERC721AStorage

### Layout

```solidity
struct Layout {
  uint256 currentIndex;
  uint256 burnCounter;
  string name;
  string symbol;
  mapping(uint256 => uint256) packedOwnerships;
  mapping(address => uint256) packedAddressData;
  mapping(uint256 => struct TokenApprovalRef) tokenApprovals;
  mapping(address => mapping(address => bool)) operatorApprovals;
  uint256 price;
  uint256 maxSupply;
  string baseTokenUri;
  bool airdrop;
  uint256 maxMintPerTx;
  uint256 maxMintPerAddress;
  bool isSoulbound;
}
```

### STORAGE_SLOT

```solidity
bytes32 STORAGE_SLOT
```

### layout

```solidity
function layout() internal pure returns (struct ERC721AStorage.Layout l)
```
