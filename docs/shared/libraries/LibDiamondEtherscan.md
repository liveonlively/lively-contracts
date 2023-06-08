# Solidity API

## LibDiamondEtherscan

### Upgraded

```solidity
event Upgraded(address implementation)
```

### IMPLEMENTATION_SLOT

```solidity
bytes32 IMPLEMENTATION_SLOT
```

_Storage slot with the address of the current dummy-implementation.
This is the keccak-256 hash of "eip1967.proxy.implementation" subtracted by 1_

### _setDummyImplementation

```solidity
function _setDummyImplementation(address implementationAddress) internal
```

### _dummyImplementation

```solidity
function _dummyImplementation() internal view returns (address)
```

