# dummy/DummyDiamond1155Implementation.md

## DummyDiamond1155Implementation

This is a generated dummy diamond implementation for compatibility with etherscan. For full contract implementation,
check out the diamond on louper: https://louper.dev/

### Tuple800840

```solidity
struct Tuple800840 {
  uint256 maxSupply;
  uint256 price;
  address creator;
  string tokenUri;
  bool allowListEnabled;
  uint256 startTime;
  bool isCrossmintUSDC;
}
```

### Tuple2548212

```solidity
struct Tuple2548212 {
  uint256 maxSupply;
  uint256 price;
  address creator;
  string tokenUri;
  bool allowListEnabled;
  uint256 startTime;
  bool isCrossmintUSDC;
}
```

### Tuple9790819

```solidity
struct Tuple9790819 {
  uint256 maxSupply;
  uint256 price;
  address creator;
  string tokenUri;
  bool allowListEnabled;
  uint256 startTime;
  bool isCrossmintUSDC;
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

### accountsByToken

```solidity
function accountsByToken(uint256 id) external view returns (address[])
```

### balanceOf

```solidity
function balanceOf(address account, uint256 id) external view returns (uint256)
```

### balanceOfBatch

```solidity
function balanceOfBatch(address[] accounts, uint256[] ids) external view returns (uint256[])
```

### crossmintMint

```solidity
function crossmintMint(address account, uint256 id, uint256 amount) external
```

### crossmintPackMint

```solidity
function crossmintPackMint(address account, uint256 packId, uint256 amount) external
```

### isApprovedForAll

```solidity
function isApprovedForAll(address account, address operator) external view returns (bool)
```

### mint

```solidity
function mint(address account, uint256 id, uint256 amount, uint8 mintType) external
```

### safeBatchTransferFrom

```solidity
function safeBatchTransferFrom(address from, address to, uint256[] ids, uint256[] amounts, bytes data) external
```

### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data) external
```

### setApprovalForAll

```solidity
function setApprovalForAll(address operator, bool status) external
```

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) external view returns (bool)
```

### tokensByAccount

```solidity
function tokensByAccount(address account) external view returns (uint256[])
```

### totalHolders

```solidity
function totalHolders(uint256 id) external view returns (uint256)
```

### totalSupply

```solidity
function totalSupply(uint256 id) external view returns (uint256)
```

### uri

```solidity
function uri(uint256 tokenId) external view returns (string)
```

### OPERATOR_FILTER_REGISTRY

```solidity
function OPERATOR_FILTER_REGISTRY() external view returns (address)
```

### batchCreate

```solidity
function batchCreate(uint256 _amount, struct DummyDiamond1155Implementation.Tuple800840 _tokenData) external returns (bool success)
```

### batchCreate

```solidity
function batchCreate(struct DummyDiamond1155Implementation.Tuple2548212[] _tokenData) external returns (bool success)
```

### burn

```solidity
function burn(address account, uint256 id, uint256 amount) external
```

### create

```solidity
function create(struct DummyDiamond1155Implementation.Tuple800840 _tokenData) external returns (uint256 _id)
```

### exists

```solidity
function exists(uint256 _tokenId) external view returns (bool)
```

### maxSupply

```solidity
function maxSupply(uint256 _id) external view returns (uint256)
```

### mint

```solidity
function mint(address account, uint256 id, uint256 amount) external payable
```

### mint

```solidity
function mint(address[] accounts, uint256 id, uint256 amount) external
```

### name

```solidity
function name() external view returns (string)
```

### packCreate

```solidity
function packCreate(uint256[] _tokenIds, uint256 _price, uint256 _startTime) external
```

### packMint

```solidity
function packMint(address account, uint256 packId, uint256 amount) external payable
```

### packPrice

```solidity
function packPrice(uint256 _packId) external view returns (uint256)
```

### packStartTime

```solidity
function packStartTime(uint256 _packId) external view returns (uint256)
```

### packTokenIds

```solidity
function packTokenIds(uint256 _packId) external view returns (uint256[])
```

### price

```solidity
function price(uint256 _id) external view returns (uint256)
```

### setMaxSupply

```solidity
function setMaxSupply(uint256 _id, uint256 _maxSupply) external
```

### setName

```solidity
function setName(string _name) external
```

### setPrice

```solidity
function setPrice(uint256 _id, uint256 _price) external
```

### setStartTime

```solidity
function setStartTime(uint256 _id, uint256 _startTime) external
```

### setSymbol

```solidity
function setSymbol(string _symbol) external
```

### setTokenData

```solidity
function setTokenData(uint256 _id, struct DummyDiamond1155Implementation.Tuple800840 _tokenData) external
```

### startTime

```solidity
function startTime(uint256 _id) external view returns (uint256)
```

### symbol

```solidity
function symbol() external view returns (string)
```

### tokenData

```solidity
function tokenData(uint256 id) external view returns (struct DummyDiamond1155Implementation.Tuple9790819)
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
function allowList(uint256 _tokenId) external view returns (struct DummyDiamond1155Implementation.Tuple576603[] allowListMap)
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
function diamondCut(struct DummyDiamond1155Implementation.Tuple6871229[] _diamondCut, address _init, bytes _calldata) external
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
function facets() external view returns (struct DummyDiamond1155Implementation.Tuple1236461[] facets_)
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
