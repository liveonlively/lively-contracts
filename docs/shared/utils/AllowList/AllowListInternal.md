# shared/utils/AllowList/AllowListInternal.md

## AllowListInternal

### allowListed

```solidity
modifier allowListed(uint256 tokenId, address account)
```

### isAllowListed

```solidity
function isAllowListed(uint256 tokenId, address account) internal view returns (bool)
```

### _allowListAllowance

```solidity
function _allowListAllowance(uint256 tokenId, address account) internal view returns (uint256)
```

### _addToAllowList

```solidity
function _addToAllowList(uint256 tokenId, address _account, uint256 _allowance, uint256 _allowTime) internal
```

### _addToAllowList

```solidity
function _addToAllowList(uint256 tokenId, address[] _accounts, uint256 _allowance) internal
```

### _addToAllowList

```solidity
function _addToAllowList(uint256 tokenId, address[] _accounts, uint256 _allowance, uint256 _allowTime) internal
```

### _removeFromAllowList

```solidity
function _removeFromAllowList(uint256 tokenId, address _account) internal
```

### _removeFromAllowList

```solidity
function _removeFromAllowList(uint256 tokenId, address[] _accounts) internal
```

### _allowListContains

```solidity
function _allowListContains(uint256 tokenId, address _account) internal view returns (bool)
```

