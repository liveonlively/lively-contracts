# shared/utils/AllowList/IAllowListInternal.md

## IAllowListInternal

### AccountNotAllowListed

```solidity
error AccountNotAllowListed()
```

### AccountAlreadyAllowListed

```solidity
error AccountAlreadyAllowListed()
```

### AllowListEnabled

```solidity
error AllowListEnabled()
```

### AllowListDisabled

```solidity
error AllowListDisabled()
```

### MintNotOpen

```solidity
error MintNotOpen()
```

### NotOnAllowList

```solidity
error NotOnAllowList()
```

### AllowListAmountExceeded

```solidity
error AllowListAmountExceeded()
```

### AllowListMintUnopened

```solidity
error AllowListMintUnopened()
```

### AllowListStatus

```solidity
event AllowListStatus(bool status)
```

### AllowListAdded

```solidity
event AllowListAdded(address account, uint256 allowance)
```

### AllowListAdded

```solidity
event AllowListAdded(address[] accounts, uint256 allowance)
```

### AllowListRemoved

```solidity
event AllowListRemoved(address account)
```

### AllowListRemoved

```solidity
event AllowListRemoved(address[] accounts)
```

### AllowListStatus

```solidity
event AllowListStatus(uint256 tokenId, bool status)
```

### AllowListAdded

```solidity
event AllowListAdded(uint256 tokenId, address account, uint256 allowance)
```

### AllowListAdded

```solidity
event AllowListAdded(uint256 tokenId, address[] accounts, uint256 allowance)
```

### AllowListRemoved

```solidity
event AllowListRemoved(uint256 tokenId, address account)
```

### AllowListRemoved

```solidity
event AllowListRemoved(uint256 tokenId, address[] accounts)
```
