# ERC721-Diamond/interfaces/IERC721A.md

## IERC721A

_Interface of ERC721A._

### EditionsEnabled

```solidity
error EditionsEnabled()
```

Editions are enabled

### InvalidMerkleProof

```solidity
error InvalidMerkleProof()
```

Merkle proof is invalid

### ExceedsMaxSupply

```solidity
error ExceedsMaxSupply()
```

Exceed max supply

### ExceedsMaxMintPerAddress

```solidity
error ExceedsMaxMintPerAddress()
```

Exceeds max mint per address

### ExceedsMaxMintPerTx

```solidity
error ExceedsMaxMintPerTx()
```

Exceeds max mint per tx

### InvalidValueSent

```solidity
error InvalidValueSent()
```

Invalid value sent

### InvalidAirdropCaller

```solidity
error InvalidAirdropCaller()
```

Invalid airdrop caller

### ApprovalCallerNotOwnerNorApproved

```solidity
error ApprovalCallerNotOwnerNorApproved()
```

The caller must own the token or be an approved operator.

### ApprovalQueryForNonexistentToken

```solidity
error ApprovalQueryForNonexistentToken()
```

The token does not exist.

### BalanceQueryForZeroAddress

```solidity
error BalanceQueryForZeroAddress()
```

Cannot query the balance for the zero address.

### MintToZeroAddress

```solidity
error MintToZeroAddress()
```

Cannot mint to the zero address.

### MintZeroQuantity

```solidity
error MintZeroQuantity()
```

The quantity of tokens minted must be more than zero.

### OwnerQueryForNonexistentToken

```solidity
error OwnerQueryForNonexistentToken()
```

The token does not exist.

### TransferCallerNotOwnerNorApproved

```solidity
error TransferCallerNotOwnerNorApproved()
```

The caller must own the token or be an approved operator.

### TransferFromIncorrectOwner

```solidity
error TransferFromIncorrectOwner()
```

The token must be owned by `from`.

### TransferToNonERC721ReceiverImplementer

```solidity
error TransferToNonERC721ReceiverImplementer()
```

Cannot safely transfer to a contract that does not implement the ERC721Receiver interface.

### TransferToZeroAddress

```solidity
error TransferToZeroAddress()
```

Cannot transfer to the zero address.

### URIQueryForNonexistentToken

```solidity
error URIQueryForNonexistentToken()
```

The token does not exist.

### MintERC2309QuantityExceedsLimit

```solidity
error MintERC2309QuantityExceedsLimit()
```

The `quantity` minted with ERC2309 exceeds the safety limit.

### OwnershipNotInitializedForExtraData

```solidity
error OwnershipNotInitializedForExtraData()
```

The `extraData` cannot be set on an unintialized ownership slot.

### totalSupply

```solidity
function totalSupply() external view returns (uint256)
```

_Returns the total number of tokens in existence. Burned tokens will reduce the count. To get the total number of tokens
minted, please see {\_totalMinted}._

### Transfer

```solidity
event Transfer(address from, address to, uint256 tokenId)
```

_Emitted when `tokenId` token is transferred from `from` to `to`._

### Approval

```solidity
event Approval(address owner, address approved, uint256 tokenId)
```

_Emitted when `owner` enables `approved` to manage the `tokenId` token._

### ApprovalForAll

```solidity
event ApprovalForAll(address owner, address operator, bool approved)
```

_Emitted when `owner` enables or disables (`approved`) `operator` to manage all of its assets._

### balanceOf

```solidity
function balanceOf(address owner) external view returns (uint256 balance)
```

_Returns the number of tokens in `owner`'s account._

### ownerOf

```solidity
function ownerOf(uint256 tokenId) external view returns (address owner)
```

\_Returns the owner of the `tokenId` token.

Requirements:

- `tokenId` must exist.\_

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 tokenId, bytes data) external
```

\_Safely transfers `tokenId` token from `from` to `to`, checking first that contract recipients are aware of the ERC721
protocol to prevent tokens from being forever locked.

Requirements:

- `from` cannot be the zero address.
- `to` cannot be the zero address.
- `tokenId` token must exist and be owned by `from`.
- If the caller is not `from`, it must be have been allowed to move this token by either {approve} or
  {setApprovalForAll}.
- If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe
  transfer.

Emits a {Transfer} event.\_

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 tokenId) external
```

_Equivalent to `safeTransferFrom(from, to, tokenId, '')`._

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 tokenId) external
```

\_Transfers `tokenId` from `from` to `to`.

WARNING: Usage of this method is discouraged, use {safeTransferFrom} whenever possible.

Requirements:

- `from` cannot be the zero address.
- `to` cannot be the zero address.
- `tokenId` token must be owned by `from`.
- If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}.

Emits a {Transfer} event.\_

### approve

```solidity
function approve(address to, uint256 tokenId) external
```

\_Gives permission to `to` to transfer `tokenId` token to another account. The approval is cleared when the token is
transferred.

Only a single account can be approved at a time, so approving the zero address clears previous approvals.

Requirements:

- The caller must own the token or be an approved operator.
- `tokenId` must exist.

Emits an {Approval} event.\_

### setApprovalForAll

```solidity
function setApprovalForAll(address operator, bool _approved) external
```

\_Approve or remove `operator` as an operator for the caller. Operators can call {transferFrom} or {safeTransferFrom}
for any token owned by the caller.

Requirements:

- The `operator` cannot be the caller.

Emits an {ApprovalForAll} event.\_

### getApproved

```solidity
function getApproved(uint256 tokenId) external view returns (address operator)
```

\_Returns the account approved for `tokenId` token.

Requirements:

- `tokenId` must exist.\_

### isApprovedForAll

```solidity
function isApprovedForAll(address owner, address operator) external view returns (bool)
```

\_Returns if the `operator` is allowed to manage all of the assets of `owner`.

See {setApprovalForAll}.\_

### name

```solidity
function name() external view returns (string)
```

_Returns the token collection name._

### symbol

```solidity
function symbol() external view returns (string)
```

_Returns the token collection symbol._

### tokenURI

```solidity
function tokenURI(uint256 tokenId) external view returns (string)
```

_Returns the Uniform Resource Identifier (URI) for `tokenId` token._

### ConsecutiveTransfer

```solidity
event ConsecutiveTransfer(uint256 fromTokenId, uint256 toTokenId, address from, address to)
```

\_Emitted when tokens in `fromTokenId` to `toTokenId` (inclusive) is transferred from `from` to `to`, as defined in the
[ERC2309](https://eips.ethereum.org/EIPS/eip-2309) standard.

See {_mintERC2309} for more details._
