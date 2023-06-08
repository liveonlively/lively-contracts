# Solidity API

## IDiamondCut

### FacetCutAction

```solidity
enum FacetCutAction {
  Add,
  Replace,
  Remove
}
```

### FacetCut

```solidity
struct FacetCut {
  address facetAddress;
  enum IDiamondCut.FacetCutAction action;
  bytes4[] functionSelectors;
}
```

### diamondCut

```solidity
function diamondCut(struct IDiamondCut.FacetCut[] _diamondCut, address _init, bytes _calldata) external
```

Add/replace/remove any number of functions and optionally execute
        a function with delegatecall

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _diamondCut | struct IDiamondCut.FacetCut[] | Contains the facet addresses and function selectors |
| _init | address | The address of the contract or facet to execute _calldata |
| _calldata | bytes | A function call, including function selector and arguments                  _calldata is executed with delegatecall on _init |

### DiamondCut

```solidity
event DiamondCut(struct IDiamondCut.FacetCut[] _diamondCut, address _init, bytes _calldata)
```

