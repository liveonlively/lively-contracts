# shared/utils/AllowList/AllowList.md

## AllowList

### _enableAllowList

```solidity
function _enableAllowList(uint256 tokenId) internal
```

### _disableAllowList

```solidity
function _disableAllowList(uint256 tokenId) internal
```

### addToAllowList

```solidity
function addToAllowList(uint256 tokenId, address account) external
```

### addToAllowList

```solidity
function addToAllowList(uint256 tokenId, address account, uint256 allowance) external
```

### addToAllowList

```solidity
function addToAllowList(uint256 tokenId, address account, uint256 allowance, uint256 allowTime) external
```

### addToAllowList

```solidity
function addToAllowList(uint256 tokenId, address[] accounts) external
```

### addToAllowList

```solidity
function addToAllowList(uint256 tokenId, address[] accounts, uint256 allowance) external
```

### addToAllowList

```solidity
function addToAllowList(uint256 tokenId, address[] accounts, uint256 allowance, uint256 allowTime) external
```

### removeFromAllowList

```solidity
function removeFromAllowList(uint256 tokenId, address account) external
```

### removeFromAllowList

```solidity
function removeFromAllowList(uint256 tokenId, address[] accounts) external
```

### allowListContains

```solidity
function allowListContains(uint256 tokenId, address account) external view returns (bool contains)
```

