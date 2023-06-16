# shared/utils/PaymentSplitter/IPaymentSplitterInternal.md

## IPaymentSplitterInternal

\_This contract allows to split Ether payments among a group of accounts. The sender does not need to be aware that the
Ether will be split in this way, since it is handled transparently by the contract.

The split can be in equal parts or in any other arbitrary proportion. The way this is specified is by assigning each
account to a number of shares. Of all the Ether that this contract receives, each account will then be able to claim an
amount proportional to the percentage of total shares they were assigned. The distribution of shares is set at the time
of contract deployment and can't be updated thereafter.

`PaymentSplitter` follows a _pull payment_ model. This means that payments are not automatically forwarded to the
accounts but kept in this contract, and the actual transfer is triggered as a separate step by calling the {release}
function.

NOTE: This contract assumes that ERC20 tokens will behave similarly to native tokens (Ether). Rebasing tokens, and
tokens that apply fees during transfers, are likely to not be supported as expected. If in doubt, we encourage you to
run tests before sending real value to this contract.\_

### PaymentSplitterMismatch

```solidity
error PaymentSplitterMismatch()
```

### PaymentSplitterNoPayees

```solidity
error PaymentSplitterNoPayees()
```

### PaymentSplitterZeroShares

```solidity
error PaymentSplitterZeroShares()
```

### PaymentSplitterZeroAddress

```solidity
error PaymentSplitterZeroAddress()
```

### PaymentSplitterAlreadyHasShares

```solidity
error PaymentSplitterAlreadyHasShares()
```

### PaymentSplitterZeroFundsDue

```solidity
error PaymentSplitterZeroFundsDue()
```

### InvalidPayee

```solidity
error InvalidPayee()
```

### PayeeNotSender

```solidity
error PayeeNotSender()
```

### PayeeAdded

```solidity
event PayeeAdded(address account, uint256 shares)
```

### PaymentReceived

```solidity
event PaymentReceived(address from, uint256 amount)
```

### PaymentReleased

```solidity
event PaymentReleased(address to, uint256 amount)
```

### ERC20PaymentReleased

```solidity
event ERC20PaymentReleased(contract IERC20 token, address to, uint256 amount)
```
