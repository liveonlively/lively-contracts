// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/******************************************************************************\
* Author: Nick Mudge <nick@perfectabstractions.com> (https://twitter.com/mudgen)
* EIP-2535 Diamonds: https://eips.ethereum.org/EIPS/eip-2535
*
* Implementation of a diamond.
/******************************************************************************/

import { LibDiamond } from "../shared/libraries/LibDiamond.sol";
import { IDiamondCut } from "../shared/interfaces/IDiamondCut.sol";
import { OwnableStorage, OwnableInternal } from "@solidstate/contracts/access/ownable/OwnableInternal.sol";
import { PaymentSplitterInternal } from "../shared/utils/PaymentSplitter/PaymentSplitterInternal.sol";
import { ERC1155Facet } from "./facets/ERC1155Facet.sol";
// Storage
import { ERC2981Storage } from "@solidstate/contracts/token/common/ERC2981/ERC2981Storage.sol";
import { ERC1155Storage } from "./utils/ERC1155/ERC1155Storage.sol";
import { ERC1155MetadataStorage } from "@solidstate/contracts/token/ERC1155/metadata/ERC1155MetadataStorage.sol";
import { ERC1155EnumerableStorage } from "@solidstate/contracts/token/ERC1155/enumerable/ERC1155EnumerableStorage.sol";

contract Lively1155Diamond is PaymentSplitterInternal, OwnableInternal {
    string private constant CONTRACT_VERSION = "0.0.1";

    using ERC2981Storage for ERC2981Storage.Layout;

    event URI(string _value, uint256 indexed _id);

    /** @dev Think about cutting this constructor down and using multicall
     * transactions to set up in the contract in efficient way without bloating
     * the main constructor.  */

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
    }

    constructor(IDiamondCut.FacetCut[] memory _diamondCut, address _init, bytes memory _calldata) payable {
        LibDiamond.diamondCut(_diamondCut, _init, _calldata);
    }

    // Find facet for function that is called and execute the
    // function if a facet is found and return any value.
    fallback() external payable {
        LibDiamond.DiamondStorage storage ds;
        bytes32 position = LibDiamond.DIAMOND_STORAGE_POSITION;
        // get diamond storage
        assembly {
            ds.slot := position
        }
        // get facet from function selector
        address facet = address(bytes20(ds.facets[msg.sig]));
        require(facet != address(0), "Diamond: Function does not exist");
        // Execute external function from facet using delegatecall and return any value.
        assembly {
            // copy function selector and any arguments
            calldatacopy(0, 0, calldatasize())
            // execute function call using the facet
            let result := delegatecall(gas(), facet, 0, calldatasize(), 0, 0)
            // get any return value
            returndatacopy(0, 0, returndatasize())
            // return any return value or error back to the caller
            switch result
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }

    receive() external payable {
        emit PaymentReceived(msg.sender, msg.value);
    }
}
