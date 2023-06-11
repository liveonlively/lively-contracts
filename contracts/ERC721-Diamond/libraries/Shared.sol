// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {LibDiamond} from "../../shared/libraries/LibDiamond.sol";
import {OwnableStorage} from "@solidstate/contracts/access/ownable/Ownable.sol";
import {ERC721AStorage} from "../utils/ERC721A/ERC721AStorage.sol";
import {
    PaymentSplitterStorage
} from "../../shared/utils/PaymentSplitter/PaymentSplitterStorage.sol";
import {EditionsStorage, Edition} from "../utils/Editions/EditionsStorage.sol";

library Shared {
    string private constant CONTRACT_VERSION = "0.0.1";

    event PayeeAdded(address account, uint256 shares);
    event PaymentReceived(address from, uint256 amount);
    event RoleGranted(
        bytes32 indexed role,
        address indexed account,
        address indexed sender
    );
    event EditionCreate(
        uint256 editionIndex,
        string name,
        uint256 price,
        uint256 maxSupply
    );

    error PaymentSplitterAccountAddressZero();
    error PaymentSplitterSharesZero();
    error PaymentSplitterAccountHasShares();
    error EditionsDisabled();
    error NameRequired();

    /**
     * @dev Add a new payee to the contract.
     * @param account The address of the payee to add.
     * @param _shares The number of shares owned by the payee.
     */
    function _addPayee(address account, uint256 _shares) internal {
        PaymentSplitterStorage.Layout storage pss = PaymentSplitterStorage
            .layout();

        require(
            OwnableStorage.layout().owner == msg.sender,
            "Only owner can add payee"
        );

        if (account == address(0)) {
            revert PaymentSplitterAccountAddressZero();
        }

        if (_shares == 0) {
            revert PaymentSplitterSharesZero();
        }

        if (pss.shares[account] > 0) {
            revert PaymentSplitterAccountHasShares();
        }

        pss.payees.push(account);
        pss.shares[account] = _shares;
        pss.totalShares = pss.totalShares + _shares;
        emit PayeeAdded(account, _shares);
    }

    // TODO: Need to revamp roles
    // /**
    //  * @dev Grants `role` to `account`.
    //  *
    //  * Internal function without access restriction.
    //  *
    //  * May emit a {RoleGranted} event.
    //  */
    // function _grantRole(bytes32 role, address account) internal {
    //     ERC721AStorage.Layout storage s = ERC721AStorage.layout();

    //     require(
    //         OwnableStorage.layout().owner == msg.sender,
    //         "Only owner can grantRole"
    //     );

    //     if (!hasRole(role, account)) {
    //         s.roles[role].members[account] = true;
    //         emit RoleGranted(role, account, msg.sender);
    //     }
    // }

    // /**
    //  * @dev Returns `true` if `account` has been granted `role`.
    //  */
    // function hasRole(
    //     bytes32 role,
    //     address account
    // ) internal view returns (bool) {
    //     ERC721AStorage.Layout storage s = ERC721AStorage.layout();

    //     return s.roles[role].members[account];
    // }

    function createEdition(
        string memory _name,
        uint256 _maxSupply,
        uint256 _price
    ) internal {
        ERC721AStorage.Layout storage s = ERC721AStorage.layout();
        EditionsStorage.Layout storage es = EditionsStorage.layout();

        require(
            OwnableStorage.layout().owner == msg.sender,
            "Only owner can createEdition"
        );

        if (!es.editionsEnabled) revert EditionsDisabled();
        if (bytes(_name).length == 0) revert NameRequired();

        uint256 index = es.editionsByIndex.length;

        Edition memory _edition = Edition({
            name: _name,
            maxSupply: _maxSupply,
            price: _price,
            totalSupply: 0
        });

        es.editionsByIndex.push(_edition);
        s.maxSupply = s.maxSupply + _maxSupply;

        emit EditionCreate(index, _name, _price, _maxSupply);
    }
}
