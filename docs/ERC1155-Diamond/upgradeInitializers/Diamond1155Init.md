# Solidity API

## Diamond1155Init

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
  bool _isPriceUSD;
  bool _automaticUSDConversion;
}
```

### init

```solidity
function init(struct Diamond1155Init.DiamondArgs _args) external
```

_Initialize the 1155 diamond with the data you need_

