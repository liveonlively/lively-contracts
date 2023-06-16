# dummy/DummyDiamond721Implementation.md

## DummyDiamond721Implementation

This is a generated dummy diamond implementation for compatibility with etherscan. For full contract implementation,
check out the diamond on louper: https://louper.dev/

### Tuple4362849

```solidity
struct Tuple4362849 {
  address addr;
  uint64 startTimestamp;
  bool burned;
  uint24 extraData;
}
```

### Tuple4244095

```solidity
struct Tuple4244095 {
  address addr;
  uint64 startTimestamp;
  bool burned;
  uint24 extraData;
}
```

### Tuple6871229

```solidity
struct Tuple6871229 {
  address facetAddress;
  uint8 action;
  bytes4[] functionSelectors;
}
```

### Tuple576603

```solidity
struct Tuple576603 {
  address account;
  uint256 allowance;
}
```

### Tuple1236461

```solidity
struct Tuple1236461 {
  address facetAddress;
  bytes4[] functionSelectors;
}
```

### airdrop

```solidity
function airdrop() external view returns (bool)
```

### approve

```solidity
function approve(address to, uint256 tokenId) external
```

### balanceOf

```solidity
function balanceOf(address owner) external view returns (uint256)
```

### burn

```solidity
function burn(uint256 tokenId) external
```

### getApproved

```solidity
function getApproved(uint256 tokenId) external view returns (address)
```

### isApprovedForAll

```solidity
function isApprovedForAll(address owner, address operator) external view returns (bool)
```

### isSoulbound

```solidity
function isSoulbound() external view returns (bool)
```

### maxMintPerAddress

```solidity
function maxMintPerAddress() external view returns (uint256)
```

### maxMintPerTx

```solidity
function maxMintPerTx() external view returns (uint256)
```

### maxSupply

```solidity
function maxSupply() external view returns (uint256)
```

### mint

```solidity
function mint(address to, uint256 amount) external payable
```

### mint

```solidity
function mint(address to) external payable
```

### name

```solidity
function name() external view returns (string)
```

### ownerOf

```solidity
function ownerOf(uint256 tokenId) external view returns (address)
```

### price

```solidity
function price() external view returns (uint256)
```

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 tokenId) external
```

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 tokenId, bytes _data) external
```

### setAirdrop

```solidity
function setAirdrop(bool _airdrop) external
```

### setApprovalForAll

```solidity
function setApprovalForAll(address operator, bool approved) external
```

### setAutomaticUSDConversion

```solidity
function setAutomaticUSDConversion(bool _automaticUSDConversion) external
```

### setIsPriceUSD

```solidity
function setIsPriceUSD(bool _isPriceUSD) external
```

### setMaxMintPerAddress

```solidity
function setMaxMintPerAddress(uint256 _maxMintPerAddress) external
```

### setMaxMintPerTx

```solidity
function setMaxMintPerTx(uint256 _maxMintPerTx) external
```

### setMaxSupply

```solidity
function setMaxSupply(uint256 _maxSupply) external
```

### setName

```solidity
function setName(string _name) external
```

### setPrice

```solidity
function setPrice(uint256 _price) external
```

### setSoulbound

```solidity
function setSoulbound(bool _isSoulbound) external
```

### setSymbol

```solidity
function setSymbol(string _symbol) external
```

### setTokenURI

```solidity
function setTokenURI(string tokenURI) external
```

### symbol

```solidity
function symbol() external view returns (string)
```

### tokenURI

```solidity
function tokenURI(uint256 tokenId) external view returns (string)
```

### totalSupply

```solidity
function totalSupply() external view returns (uint256)
```

### transferFrom

```solidity
function transferFrom(address from, address to, uint256 tokenId) external
```

### createEdition

```solidity
function createEdition(string _name, uint256 _maxSupply, uint256 _price) external
```

### enableEditions

```solidity
function enableEditions() external
```

### maxSupply

```solidity
function maxSupply(uint256 _editionIndex) external view returns (uint256)
```

### mint

```solidity
function mint(address to, uint256 amount, uint256 editionIndex) external payable
```

### price

```solidity
function price(uint256 _editionIndex) external view returns (uint256)
```

### setMaxSupply

```solidity
function setMaxSupply(uint256 _maxSupply, uint256 _editionIndex) external
```

### setPrice

```solidity
function setPrice(uint256 _price, uint256 _editionIndex) external
```

### totalSupply

```solidity
function totalSupply(uint256 _editionIndex) external view returns (uint256)
```

### updateTotalSupply

```solidity
function updateTotalSupply(uint256 _totalSuppy, uint256 _editionIndex) external
```

### explicitOwnershipOf

```solidity
function explicitOwnershipOf(uint256 tokenId) external view returns (struct DummyDiamond721Implementation.Tuple4362849)
```

### explicitOwnershipsOf

```solidity
function explicitOwnershipsOf(uint256[] tokenIds) external view returns (struct DummyDiamond721Implementation.Tuple4244095[])
```

### getEditionIndex

```solidity
function getEditionIndex(uint256 _tokenId) external view returns (uint256)
```

### getEditionsByOwner

```solidity
function getEditionsByOwner(address _owner) external view returns (uint256[])
```

### getOwners

```solidity
function getOwners() external view returns (address[])
```

### getOwners

```solidity
function getOwners(uint256 _editionIndex) external view returns (address[])
```

### getTokensByOwner

```solidity
function getTokensByOwner(address _owner) external view returns (uint256[])
```

### getTokensByOwner

```solidity
function getTokensByOwner(address _owner, uint256 _editionIndex) external view returns (uint256[])
```

### ownsEdition

```solidity
function ownsEdition(address _owner, uint256 editionIndex) external view returns (bool)
```

### tokensOfOwner

```solidity
function tokensOfOwner(address owner) external view returns (uint256[])
```

### tokensOfOwnerIn

```solidity
function tokensOfOwnerIn(address owner, uint256 start, uint256 stop) external view returns (uint256[])
```

### \_\_transitiveOwner

```solidity
function __transitiveOwner() external view returns (address)
```

### addPayee

```solidity
function addPayee(address account, uint256 shares_) external
```

### addToAllowList

```solidity
function addToAllowList(uint256 tokenId, address account) external
```

### addToAllowList

```solidity
function addToAllowList(uint256 tokenId, address[] accounts, uint256 allowance) external
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
function addToAllowList(uint256 tokenId, address account, uint256 allowance) external
```

### addToAllowList

```solidity
function addToAllowList(uint256 tokenId, address[] accounts, uint256 allowance, uint256 allowTime) external
```

### allowList

```solidity
function allowList(uint256 _tokenId) external view returns (struct DummyDiamond721Implementation.Tuple576603[] allowListMap)
```

### allowListContains

```solidity
function allowListContains(uint256 tokenId, address account) external view returns (bool contains)
```

### allowListEnabled

```solidity
function allowListEnabled(uint256 _tokenId) external view returns (bool enabled)
```

### contractURI

```solidity
function contractURI() external view returns (string)
```

### diamondCut

```solidity
function diamondCut(struct DummyDiamond721Implementation.Tuple6871229[] _diamondCut, address _init, bytes _calldata) external
```

### disableAllowList

```solidity
function disableAllowList(uint256 _tokenId) external
```

### enableAllowList

```solidity
function enableAllowList(uint256 _tokenId) external
```

### facetAddress

```solidity
function facetAddress(bytes4 _functionSelector) external view returns (address facetAddress_)
```

### facetAddresses

```solidity
function facetAddresses() external view returns (address[] facetAddresses_)
```

### facetFunctionSelectors

```solidity
function facetFunctionSelectors(address _facet) external view returns (bytes4[] _facetFunctionSelectors)
```

### facets

```solidity
function facets() external view returns (struct DummyDiamond721Implementation.Tuple1236461[] facets_)
```

### implementation

```solidity
function implementation() external view returns (address)
```

### owner

```solidity
function owner() external view returns (address)
```

### pause

```solidity
function pause() external
```

### paused

```solidity
function paused() external view returns (bool)
```

### payee

```solidity
function payee(uint256 index) external view returns (address)
```

### releasable

```solidity
function releasable(address account) external view returns (uint256)
```

### releasable

```solidity
function releasable(address token, address account) external view returns (uint256)
```

### release

```solidity
function release(address account) external
```

### release

```solidity
function release(address token, address account) external
```

### released

```solidity
function released(address token, address account) external view returns (uint256)
```

### released

```solidity
function released(address account) external view returns (uint256)
```

### removeFromAllowList

```solidity
function removeFromAllowList(uint256 tokenId, address account) external
```

### removeFromAllowList

```solidity
function removeFromAllowList(uint256 tokenId, address[] accounts) external
```

### royaltyInfo

```solidity
function royaltyInfo(uint256 tokenId, uint256 salePrice) external view returns (address, uint256)
```

### setDefaultRoyalty

```solidity
function setDefaultRoyalty(uint16 _defaultRoyaltyBPS, address _defaultRoyalyReceiver) external
```

### setDummyImplementation

```solidity
function setDummyImplementation(address _implementation) external
```

### shares

```solidity
function shares(address account) external view returns (uint256)
```

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) external view returns (bool)
```

### totalReleased

```solidity
function totalReleased(address token) external view returns (uint256)
```

### totalReleased

```solidity
function totalReleased() external view returns (uint256)
```

### totalShares

```solidity
function totalShares() external view returns (uint256)
```

### transferOwnership

```solidity
function transferOwnership(address account) external
```

### unpause

```solidity
function unpause() external
```

### updatePaymentSplitterAddress

```solidity
function updatePaymentSplitterAddress(address _newPayee) external returns (bool success)
```
