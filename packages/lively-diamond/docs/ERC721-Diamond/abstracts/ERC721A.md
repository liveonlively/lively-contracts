# ERC721-Diamond/abstracts/ERC721A.md

## ERC721A

\_Implementation of the [ERC721](https://eips.ethereum.org/EIPS/eip-721) Non-Fungible Token Standard, including the
Metadata extension. Optimized for lower gas during batch mints.

Token IDs are minted in sequential order (e.g. 0, 1, 2, 3, ...) starting from `_startTokenId()`.

Assumptions:

- An owner cannot have more than 2\*\*64 - 1 (max value of uint64) of supply.
- The maximum token ID cannot exceed 2\*\*256 - 1 (max value of uint256).\_

### \_nextTokenId

```solidity
function _nextTokenId() internal view virtual returns (uint256)
```

_Returns the next token ID to be minted._

### totalSupply

```solidity
function totalSupply() public view virtual returns (uint256)
```

_Returns the total number of tokens in existence. Burned tokens will reduce the count. To get the total number of tokens
minted, please see {\_totalMinted}._

### \_totalMinted

```solidity
function _totalMinted() internal view virtual returns (uint256)
```

_Returns the total amount of tokens minted in the contract._

### \_totalBurned

```solidity
function _totalBurned() internal view virtual returns (uint256)
```

_Returns the total number of tokens burned._

### balanceOf

```solidity
function balanceOf(address owner) public view virtual returns (uint256)
```

_Returns the number of tokens in `owner`'s account._

### \_numberMinted

```solidity
function _numberMinted(address owner) internal view returns (uint256)
```

### \_numberBurned

```solidity
function _numberBurned(address owner) internal view returns (uint256)
```

Returns the number of tokens burned by or on behalf of `owner`.

### name

```solidity
function name() public view virtual returns (string)
```

_Returns the token collection name._

### symbol

```solidity
function symbol() public view virtual returns (string)
```

_Returns the token collection symbol._

### tokenURI

```solidity
function tokenURI(uint256 tokenId) public view virtual returns (string)
```

_Returns the Uniform Resource Identifier (URI) for `tokenId` token._

### \_baseURI

```solidity
function _baseURI() internal view virtual returns (string)
```

_Base URI for computing {tokenURI}. If set, the resulting URI for each token will be the concatenation of the `baseURI`
and the `tokenId`. Empty by default, it can be overridden in child contracts._

### ownerOf

```solidity
function ownerOf(uint256 tokenId) public view returns (address)
```

\_Returns the owner of the `tokenId` token.

Requirements:

- `tokenId` must exist.\_

### \_ownershipOf

```solidity
function _ownershipOf(uint256 tokenId) internal view virtual returns (struct ERC721ALib.TokenOwnership)
```

_Gas spent here starts off proportional to the maximum mint batch size. It gradually moves to O(1) as tokens get
transferred around over time._

### \_ownershipAt

```solidity
function _ownershipAt(uint256 index) internal view virtual returns (struct ERC721ALib.TokenOwnership)
```

_Returns the unpacked `ERC721ALib.TokenOwnership` struct at `index`._

### \_initializeOwnershipAt

```solidity
function _initializeOwnershipAt(uint256 index) internal virtual
```

_Initializes the ownership slot minted at `index` for efficiency purposes._

### approve

```solidity
function approve(address to, uint256 tokenId) public virtual
```

\_Gives permission to `to` to transfer `tokenId` token to another account. The approval is cleared when the token is
transferred.

Only a single account can be approved at a time, so approving the zero address clears previous approvals.

Requirements:

- The caller must own the token or be an approved operator.
- `tokenId` must exist.

Emits an {Approval} event.\_

### getApproved

```solidity
function getApproved(uint256 tokenId) public view virtual returns (address)
```

\_Returns the account approved for `tokenId` token.

Requirements:

- `tokenId` must exist.\_

### setApprovalForAll

```solidity
function setApprovalForAll(address operator, bool approved) public virtual
```

\_Approve or remove `operator` as an operator for the caller. Operators can call {transferFrom} or {safeTransferFrom}
for any token owned by the caller.

Requirements:

- The `operator` cannot be the caller.

Emits an {ApprovalForAll} event.\_

### isApprovedForAll

```solidity
function isApprovedForAll(address owner, address operator) public view virtual returns (bool)
```

\_Returns if the `operator` is allowed to manage all of the assets of `owner`.

See {setApprovalForAll}.\_

### \_exists

```solidity
function _exists(uint256 tokenId) internal view virtual returns (bool)
```

\_Returns whether `tokenId` exists.

Tokens can be managed by their owner or approved accounts via {approve} or {setApprovalForAll}.

Tokens start existing when they are minted. See {_mint}._

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 tokenId) public virtual
```

\_Transfers `tokenId` from `from` to `to`.

Requirements:

- `from` cannot be the zero address.
- `to` cannot be the zero address.
- `tokenId` token must be owned by `from`.
- If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}.

Emits a {Transfer} event.\_

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 tokenId) public virtual
```

_Equivalent to `safeTransferFrom(from, to, tokenId, '')`._

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 tokenId, bytes _data) public virtual
```

\_Safely transfers `tokenId` token from `from` to `to`.

Requirements:

- `from` cannot be the zero address.
- `to` cannot be the zero address.
- `tokenId` token must exist and be owned by `from`.
- If the caller is not `from`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
- If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called upon a safe
  transfer.

Emits a {Transfer} event.\_

### \_mintERC2309

```solidity
function _mintERC2309(address to, uint256 quantity) internal virtual
```

\_Mints `quantity` tokens and transfers them to `to`.

This function is intended for efficient minting only during contract creation.

It emits only one {ConsecutiveTransfer} as defined in [ERC2309](https://eips.ethereum.org/EIPS/eip-2309), instead of a
sequence of {Transfer} event(s).

Calling this function outside of contract creation WILL make your contract non-compliant with the ERC721 standard. For
full ERC721 compliance, substituting ERC721 {Transfer} event(s) with the ERC2309 {ConsecutiveTransfer} event is only
permissible during contract creation.

Requirements:

- `to` cannot be the zero address.
- `quantity` must be greater than 0.

Emits a {ConsecutiveTransfer} event.\_

### \_safeMint

```solidity
function _safeMint(address to, uint256 quantity, bytes _data) internal virtual
```

\_Safely mints `quantity` tokens and transfers them to `to`.

Requirements:

- If `to` refers to a smart contract, it must implement {IERC721Receiver-onERC721Received}, which is called for each
  safe transfer.
- `quantity` must be greater than 0.

See {\_mint}.

Emits a {Transfer} event for each mint.\_

### \_safeMint

```solidity
function _safeMint(address to, uint256 quantity) internal virtual
```

_Equivalent to `_safeMint(to, quantity, '')`._

### \_burn

```solidity
function _burn(uint256 tokenId) internal virtual
```

_Equivalent to `_burn(tokenId, false)`._

### \_burn

```solidity
function _burn(uint256 tokenId, bool approvalCheck) internal virtual
```

\_Destroys `tokenId`. The approval is cleared when the token is burned.

Requirements:

- `tokenId` must exist.

Emits a {Transfer} event.\_

### \_msgSenderERC721A

```solidity
function _msgSenderERC721A() internal view virtual returns (address)
```

\_Returns the message sender (defaults to `msg.sender`).

If you are writing GSN compatible contracts, you need to override this function.\_

### \_toString

```solidity
function _toString(uint256 value) internal pure virtual returns (string str)
```

_Converts a uint256 to its ASCII string decimal representation._
