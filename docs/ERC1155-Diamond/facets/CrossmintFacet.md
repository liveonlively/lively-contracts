# Solidity API

## CrossmintFacet

### NotCrossmintUSDCToken

```solidity
error NotCrossmintUSDCToken()
```

### constructor

```solidity
constructor() public payable
```

### mint

```solidity
function mint(address account, uint256 id, uint256 amount, enum ERC1155.MintType mintType) external
```

### crossmintMint

```solidity
function crossmintMint(address account, uint256 id, uint256 amount) public
```

### crossmintPackMint

```solidity
function crossmintPackMint(address account, uint256 packId, uint256 amount) public
```

