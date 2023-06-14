# ERC721-Diamond/utils/Editions/EditionsStorage.md

## Edition

```solidity
struct Edition {
  string name;
  uint256 maxSupply;
  uint256 totalSupply;
  uint256 price;
}
```

## EditionsStorage

### Layout

```solidity
struct Layout {
  bool editionsEnabled;
  struct Edition[] editionsByIndex;
  mapping(uint256 => uint256) tokenEdition;
}
```

### STORAGE_SLOT

```solidity
bytes32 STORAGE_SLOT
```

### layout

```solidity
function layout() internal pure returns (struct EditionsStorage.Layout l)
```
