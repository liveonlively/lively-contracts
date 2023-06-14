# shared/utils/PaymentSplitter/PaymentSplitterStorage.md

## PaymentSplitterStorage

### Layout

```solidity
struct Layout {
  uint256 totalShares;
  uint256 totalReleased;
  mapping(address => uint256) shares;
  mapping(address => uint256) released;
  address[] payees;
  mapping(contract IERC20 => uint256) erc20TotalReleased;
  mapping(contract IERC20 => mapping(address => uint256)) erc20Released;
  bool isPriceUSD;
  bool automaticUSDConversion;
}
```

### STORAGE_SLOT

```solidity
bytes32 STORAGE_SLOT
```

### layout

```solidity
function layout() internal pure returns (struct PaymentSplitterStorage.Layout l)
```
