# ERC721-Diamond/abstracts/ERC721AQueryable.md

## ERC721AQueryable

_ERC721A subclass with convenience query functions._

### \_startTokenId

```solidity
function _startTokenId() internal view virtual returns (uint256)
```

### explicitOwnershipOf

```solidity
function explicitOwnershipOf(uint256 tokenId) public view virtual returns (struct IERC721AQueryable.TokenOwnership)
```

\_Returns the `TokenOwnership` struct at `tokenId` without reverting.

If the `tokenId` is out of bounds:

- `addr = address(0)`
- `startTimestamp = 0`
- `burned = false`
- `extraData = 0`

If the `tokenId` is burned:

- `addr = <Address of owner before token was burned>`
- `startTimestamp = <Timestamp when token was burned>`
- `burned = true`
- `extraData = <Extra data when token was burned>`

Otherwise:

- `addr = <Address of owner>`
- `startTimestamp = <Timestamp of start of ownership>`
- `burned = false`
- `extraData = <Extra data at start of ownership>`\_

### \_ownershipAt

```solidity
function _ownershipAt(uint256 index) internal view virtual returns (struct IERC721AQueryable.TokenOwnership)
```

_Returns the unpacked `TokenOwnership` struct at `index`._

### \_ownershipOf

```solidity
function _ownershipOf(uint256 tokenId) internal view virtual returns (struct IERC721AQueryable.TokenOwnership)
```

_Gas spent here starts off proportional to the maximum mint batch size. It gradually moves to O(1) as tokens get
transferred around over time._

### \_packedOwnershipOf

```solidity
function _packedOwnershipOf(uint256 tokenId) internal view virtual returns (uint256)
```

Returns the packed ownership data of `tokenId`.

### explicitOwnershipsOf

```solidity
function explicitOwnershipsOf(uint256[] tokenIds) external view virtual returns (struct IERC721AQueryable.TokenOwnership[])
```

_Returns an array of `TokenOwnership` structs at `tokenIds` in order. See {ERC721AQueryable-explicitOwnershipOf}_

### tokensOfOwnerIn

```solidity
function tokensOfOwnerIn(address owner, uint256 start, uint256 stop) external view virtual returns (uint256[])
```

\_Returns an array of token IDs owned by `owner`, in the range [`start`, `stop`) (i.e. `start <= tokenId < stop`).

This function allows for tokens to be queried if the collection grows too big for a single call of
{ERC721AQueryable-tokensOfOwner}.

Requirements:

- `start < stop`\_

### tokensOfOwner

```solidity
function tokensOfOwner(address owner) public view virtual returns (uint256[])
```

\_Returns an array of token IDs owned by `owner`.

This function scans the ownership mapping and is O(`totalSupply`) in complexity. It is meant to be called off-chain.

See {ERC721AQueryable-tokensOfOwnerIn} for splitting the scan into multiple smaller scans if the collection is large
enough to cause an out-of-gas error (10K collections should be fine).\_
