# shared/facets/PaymentSplitterFacet.md

## PaymentSplitterFacet

### updatePaymentSplitterAddress

```solidity
function updatePaymentSplitterAddress(address _newPayee) external returns (bool success)
```

Function that allows an owner of shares from PaymentSplitter to reset their shares to another address.

@param \_newPayee The address the shares will be reassigned to. @return success Bool on whether the function executed
successfully.
