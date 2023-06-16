// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import { PaymentSplitter, PaymentSplitterStorage } from "../utils/PaymentSplitter/PaymentSplitter.sol";

contract PaymentSplitterFacet is PaymentSplitter {
    string private constant CONTRACT_VERSION = "0.0.1";

    ///  Function that allows an owner of shares from PaymentSplitter to reset their shares to another address.
    ///
    ///  @param _newPayee The address the shares will be reassigned to.
    ///  @return success Bool on whether the function executed successfully.
    function updatePaymentSplitterAddress(address _newPayee) external returns (bool success) {
        PaymentSplitterStorage.Layout storage ps = PaymentSplitterStorage.layout();

        address _payee = msg.sender;
        if (ps.shares[_payee] == 0) revert InvalidPayee();

        ps.shares[_newPayee] = ps.shares[_payee];
        ps.released[_newPayee] = ps.released[_payee];
        delete ps.released[_payee];
        delete ps.shares[_payee];

        uint256 payeesLength = ps.payees.length;
        uint256 i;
        for (; i < payeesLength; ) {
            if (ps.payees[i] == _payee) {
                ps.payees[i] = _newPayee;
                return true;
            }
            ++i;
        }
    }
}
