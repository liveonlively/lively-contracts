// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/******************************************************************************\
* Author: Nick Mudge <nick@perfectabstractions.com> (https://twitter.com/mudgen)
* EIP-2535 Diamonds: https://eips.ethereum.org/EIPS/eip-2535
*
* Implementation of a diamond.
/******************************************************************************/

import { LibDiamond } from "../../shared/libraries/LibDiamond.sol";
import { IDiamondLoupe } from "../../shared/interfaces/IDiamondLoupe.sol";
import { IDiamondCut } from "../../shared/interfaces/IDiamondCut.sol";
import { IERC173 } from "@solidstate/contracts/interfaces/IERC173.sol";
import { IERC165 } from "@solidstate/contracts/interfaces/IERC165.sol";
import { IERC1155 } from "@solidstate/contracts/interfaces/IERC1155.sol";
import { IERC173 } from "@solidstate/contracts/interfaces/IERC173.sol";
import { IERC2981 } from "@solidstate/contracts/interfaces/IERC2981.sol";
import { IERC1155Metadata } from "@solidstate/contracts/token/ERC1155/metadata/IERC1155Metadata.sol";
import { ERC165Base, ERC165BaseStorage } from "@solidstate/contracts/introspection/ERC165/base/ERC165Base.sol";
// Storage
import { ERC2981Storage } from "@solidstate/contracts/token/common/ERC2981/ERC2981Storage.sol";
import { ERC1155Storage } from "../utils/ERC1155/ERC1155Storage.sol";
import { ERC1155MetadataStorage } from "@solidstate/contracts/token/ERC1155/metadata/ERC1155MetadataStorage.sol";
import { OwnableInternal } from "@solidstate/contracts/access/ownable/OwnableInternal.sol";
import { OwnableStorage } from "@solidstate/contracts/access/ownable/OwnableStorage.sol";
import {
    IPaymentSplitterInternal,
    PaymentSplitterStorage
} from "../../shared/utils/PaymentSplitter/PaymentSplitterInternal.sol";
import { ERC1155Lib } from "../libraries/ERC1155Lib.sol";
import { LibDiamondEtherscan } from "../../shared/libraries/LibDiamondEtherscan.sol";

// It is expected that this contract is customized if you want to deploy your diamond
// with data from a deployment script. Use the init function to initialize state variables
// of your diamond. Add parameters to the init funciton if you need to.

contract Diamond1155Init is OwnableInternal, IPaymentSplitterInternal {
    string private constant CONTRACT_VERSION = "0.0.1";

    using ERC165BaseStorage for ERC165BaseStorage.Layout;

    event URI(string _value, uint256 indexed _id);

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
        ERC1155Storage.TokenStructure[] _tokenData;
        bool _isPriceUSD;
        bool _automaticUSDConversion;
    }

    // You can add parameters to this function in order to pass in
    // data to set your own state variables
    /**
     * @dev Initialize the 1155 diamond with the data you need
     */
    function init(DiamondArgs calldata _args) external {
        // adding ERC165 data
        ERC165BaseStorage.Layout storage ds = ERC165BaseStorage.layout();

        ds.supportedInterfaces[type(IERC165).interfaceId] = true;
        ds.supportedInterfaces[type(IDiamondCut).interfaceId] = true;
        ds.supportedInterfaces[type(IDiamondLoupe).interfaceId] = true;
        ds.supportedInterfaces[type(IERC173).interfaceId] = true;
        ds.supportedInterfaces[type(IERC1155).interfaceId] = true;
        ds.supportedInterfaces[type(IERC1155Metadata).interfaceId] = true;
        ds.supportedInterfaces[type(IERC2981).interfaceId] = true;

        // add your own state variables
        // EIP-2535 specifies that the `diamondCut` function takes two optional
        // arguments: address _init and bytes calldata _calldata
        // These arguments are used to execute an arbitrary function using delegatecall
        // in order to set state variables in the diamond during deployment or an upgrade
        // More info here: https://eips.ethereum.org/EIPS/eip-2535#diamond-interface
        uint256 payeesLength;
        uint256 sharesLength = _args._shares.length;
        if (!_args._airdrop) {
            payeesLength = _args._payees.length;
            if (payeesLength != sharesLength) {
                revert PaymentSplitterMismatch();
            }

            if (payeesLength == 0) {
                revert PaymentSplitterNoPayees();
            }
        }
        ERC1155Storage.Layout storage s = ERC1155Storage.layout();
        ERC2981Storage.Layout storage ers = ERC2981Storage.layout();

        // Set various state variables
        OwnableStorage.layout().owner = msg.sender;
        ERC1155MetadataStorage.layout().baseURI = _args._baseURI;
        if (_args._airdrop) s.airdrop = _args._airdrop;
        s.name = _args._name;
        s.symbol = _args._symbol;
        s.contractURI = _args._contractURI;
        if (_args._isPriceUSD) s.isPriceUSD = _args._isPriceUSD;
        if (_args._automaticUSDConversion) s.automaticUSDConversion = _args._automaticUSDConversion;

        // Initialize PaymentSplitter information (Primary Royalties)
        uint256 i;
        for (; i < sharesLength; ) {
            _addPayee(_args._payees[i], _args._shares[i]);
            // Gas Optimization
            unchecked {
                ++i;
            }
        }

        // Initialize initial token data if available
        ERC1155Lib.batchCreate(_args._tokenData);

        // Set 2981 Royalty Info (Secondary Royalties)
        ers.defaultRoyaltyBPS = _args._secondaryShare;
        ers.defaultRoyaltyReceiver = _args._secondaryPayee;

        // Set implementation slot
        LibDiamondEtherscan._setDummyImplementation(0xf129C721C2E01Fd9c99eff3E53F50f9322333889);
    }

    function _addPayee(address account, uint256 shares_) private {
        if (account == address(0)) revert PaymentSplitterZeroAddress();
        if (shares_ == 0) revert PaymentSplitterZeroShares();

        PaymentSplitterStorage.Layout storage pss = PaymentSplitterStorage.layout();

        if (pss.shares[account] > 0) revert PaymentSplitterAlreadyHasShares();

        pss.payees.push(account);
        pss.shares[account] = shares_;
        pss.totalShares = pss.totalShares + shares_;

        emit PayeeAdded(account, shares_);
    }
}
