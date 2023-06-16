# ERC721-Diamond/LivelyDiamond.md

## LivelyDiamond

### DiamondArgs

```solidity
struct DiamondArgs {
  uint256 _price;
  uint256 _maxSupply;
  uint256 _maxMintPerTx;
  uint256 _maxMintPerAddress;
  address _secondaryPayee;
  address _owner;
  uint16 _secondaryPoints;
  address[] _payees;
  uint256[] _shares;
  string _name;
  string _symbol;
  string _contractURI;
  string _baseTokenUri;
  bool _airdrop;
  bool _allowListEnabled;
  bool _isPriceUSD;
  bool _automaticUSDConversion;
  bool _isSoulbound;
  struct Edition[] _editions;
}
```

### constructor

```solidity
constructor(struct IDiamondCut.FacetCut[] _diamondCut, struct LivelyDiamond.DiamondArgs _args) public payable
```

### fallback

```solidity
fallback() external payable
```

### receive

```solidity
receive() external payable
```
