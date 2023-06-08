# shared/facets/AllowListFacet.md

## AllowListFacet

### AllowListMap

```solidity
struct AllowListMap {
  address account;
  uint256 allowance;
}
```

### allowListEnabled

```solidity
function allowListEnabled(uint256 _tokenId) external view returns (bool enabled)
```

721's can use tokenId 0

### enableAllowList

```solidity
function enableAllowList(uint256 _tokenId) external
```

721's can use tokenId 0

### disableAllowList

```solidity
function disableAllowList(uint256 _tokenId) external
```

721's can use tokenId 0

### allowList

```solidity
function allowList(uint256 _tokenId) external view returns (struct AllowListFacet.AllowListMap[] allowListMap)
```

721's can use tokenId 0

