# Solidity API

## MetadataStorage

### Metadata

```solidity
struct Metadata {
  string description;
  string external_url;
  string image;
  string name;
  string animation_url;
  struct TokenMetadata.Attribute[] attributes;
}
```

### Layout

```solidity
struct Layout {
  mapping(uint256 => struct MetadataStorage.Metadata) metadata;
}
```

### STORAGE_SLOT

```solidity
bytes32 STORAGE_SLOT
```

### layout

```solidity
function layout() internal pure returns (struct MetadataStorage.Layout l)
```

