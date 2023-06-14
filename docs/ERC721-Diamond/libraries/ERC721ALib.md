# ERC721-Diamond/libraries/ERC721ALib.md

## ERC721ALib

### TokenIsSoulbound

```solidity
error TokenIsSoulbound()
```

### OwnershipNotInitializedForExtraData

```solidity
error OwnershipNotInitializedForExtraData()
```

### OwnerQueryForNonexistentToken

```solidity
error OwnerQueryForNonexistentToken()
```

### START_TOKEN_ID

```solidity
uint256 START_TOKEN_ID
```

### \_BITMASK_ADDRESS_DATA_ENTRY

```solidity
uint256 _BITMASK_ADDRESS_DATA_ENTRY
```

### \_BITMASK_EXTRA_DATA_COMPLEMENT

```solidity
uint256 _BITMASK_EXTRA_DATA_COMPLEMENT
```

### \_BITPOS_NUMBER_MINTED

```solidity
uint256 _BITPOS_NUMBER_MINTED
```

### \_BITPOS_EXTRA_DATA

```solidity
uint256 _BITPOS_EXTRA_DATA
```

### \_BITMASK_ADDRESS

```solidity
uint256 _BITMASK_ADDRESS
```

### \_TRANSFER_EVENT_SIGNATURE

```solidity
bytes32 _TRANSFER_EVENT_SIGNATURE
```

### \_BITPOS_START_TIMESTAMP

```solidity
uint256 _BITPOS_START_TIMESTAMP
```

### \_BITPOS_NEXT_INITIALIZED

```solidity
uint256 _BITPOS_NEXT_INITIALIZED
```

### \_BITPOS_AUX

```solidity
uint256 _BITPOS_AUX
```

### \_BITMASK_AUX_COMPLEMENT

```solidity
uint256 _BITMASK_AUX_COMPLEMENT
```

### \_BITMASK_BURNED

```solidity
uint256 _BITMASK_BURNED
```

### TokenOwnership

```solidity
struct TokenOwnership {
  address addr;
  uint64 startTimestamp;
  bool burned;
  uint24 extraData;
}
```

### \_mint

```solidity
function _mint(address to, uint256 quantity) internal
```

\_Mints `quantity` tokens and transfers them to `to`.

Requirements:

- `to` cannot be the zero address.
- `quantity` must be greater than 0.

Emits a {Transfer} event for each mint.\_

### \_packOwnershipData

```solidity
function _packOwnershipData(address owner, uint256 flags) internal view returns (uint256 result)
```

_Packs ownership data into a single uint256._

### \_beforeTokenTransfers

```solidity
function _beforeTokenTransfers(address from, address to, uint256, uint256) internal view
```

### \_afterTokenTransfers

```solidity
function _afterTokenTransfers(address from, address to, uint256 startTokenId, uint256 quantity) internal
```

\_Hook that is called after a set of serially-ordered token IDs have been transferred. This includes minting. And also
called after one token has been burned.

`startTokenId` - the first token ID to be transferred. `quantity` - the amount to be transferred.

Calling conditions:

- When `from` and `to` are both non-zero, `from`'s `tokenId` has been transferred to `to`.
- When `from` is zero, `tokenId` has been minted for `to`.
- When `to` is zero, `tokenId` has been burned by `from`.
- `from` and `to` are never both zero.\_

### \_nextInitializedFlag

```solidity
function _nextInitializedFlag(uint256 quantity) internal pure returns (uint256 result)
```

_Returns the `nextInitialized` flag set if `quantity` equals 1._

### \_nextExtraData

```solidity
function _nextExtraData(address from, address to, uint256 prevOwnershipPacked) internal pure returns (uint256)
```

_Returns the next extra data for the packed ownership data. The returned result is shifted into position._

### \_numberMinted

```solidity
function _numberMinted(address owner) internal view returns (uint256)
```

Returns the number of tokens minted by `owner`.

### \_getAux

```solidity
function _getAux(address owner) internal view returns (uint64)
```

Returns the auxiliary data for `owner`. (e.g. number of whitelist mint slots used).

### \_setAux

```solidity
function _setAux(address owner, uint64 aux) internal
```

Sets the auxiliary data for `owner`. (e.g. number of whitelist mint slots used). If there are multiple variables, please
pack them into a uint64.

### \_setExtraDataAt

```solidity
function _setExtraDataAt(uint256 index, uint24 extraData) internal
```

_Directly sets the extra data for the ownership data `index`._

### \_extraData

```solidity
function _extraData(address, address, uint24 previousExtraData) internal pure returns (uint24)
```

\_Called during each token transfer to set the 24bit `extraData` field. Intended to be overridden by the cosumer
contract.

`previousExtraData` - the value of `extraData` before transfer.

Calling conditions:

- When `from` and `to` are both non-zero, `from`'s `tokenId` will be transferred to `to`.
- When `from` is zero, `tokenId` will be minted for `to`.
- When `to` is zero, `tokenId` will be burned by `from`.
- `from` and `to` are never both zero.\_

### \_ownershipOf

```solidity
function _ownershipOf(uint256 tokenId) internal view returns (struct ERC721ALib.TokenOwnership)
```

_Gas spent here starts off proportional to the maximum mint batch size. It gradually moves to O(1) as tokens get
transferred around over time._

### \_packedOwnershipOf

```solidity
function _packedOwnershipOf(uint256 tokenId) internal view returns (uint256)
```

Returns the packed ownership data of `tokenId`.

### \_unpackedOwnership

```solidity
function _unpackedOwnership(uint256 packed) internal pure returns (struct ERC721ALib.TokenOwnership ownership)
```

_Returns the unpacked `ERC721ALib.TokenOwnership` struct from `packed`._

### ownerOf

```solidity
function ownerOf(uint256 tokenId) internal view returns (address)
```

\_Returns the owner of the `tokenId` token.

Requirements:

- `tokenId` must exist.\_
