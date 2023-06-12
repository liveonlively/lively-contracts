# shared/utils/AllowList/AllowListStorage.md

## AllowListStorage

### Layout

```solidity
struct Layout {
  mapping(uint256 => bool) allowListEnabled;
  mapping(uint256 => struct EnumerableSet.AddressSet) allowList;
  mapping(uint256 => mapping(address => uint256)) allowance;
  mapping(uint256 => mapping(address => uint256)) allowTime;
  mapping(uint256 => mapping(address => uint256)) minted;
}
```

### STORAGE_SLOT

```solidity
bytes32 STORAGE_SLOT
```

### layout

```solidity
function layout() internal pure returns (struct AllowListStorage.Layout l)
```
