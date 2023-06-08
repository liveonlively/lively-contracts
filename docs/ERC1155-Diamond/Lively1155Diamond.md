# ERC1155-Diamond/Lively1155Diamond.md

## Lively1155Diamond

### URI

```solidity
event URI(string _value, uint256 _id)
```

### DiamondArgs

```solidity
struct DiamondArgs {
  address[] _payees;
  uint256[] _shares;
  address _secondaryPayee;
  uint16 _secondaryShare;
  bool _airdrop;
  string _name;
  string _symbol;
  string _contractURI;
  string _baseURI;
  struct ERC1155Storage.TokenStructure[] _tokenData;
}
```

### constructor

```solidity
constructor(struct IDiamondCut.FacetCut[] _diamondCut, address _init, bytes _calldata) public payable
```

### fallback

```solidity
fallback() external payable
```

### receive

```solidity
receive() external payable
```

