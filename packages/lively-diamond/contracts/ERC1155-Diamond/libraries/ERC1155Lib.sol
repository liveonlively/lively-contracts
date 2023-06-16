// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { OwnableStorage } from "@solidstate/contracts/access/ownable/OwnableStorage.sol";
import { ERC1155Storage } from "../utils/ERC1155/ERC1155Storage.sol";
import { ERC1155EnumerableStorage } from "@solidstate/contracts/token/ERC1155/enumerable/ERC1155Enumerable.sol";

library ERC1155Lib {
    string private constant CONTRACT_VERSION = "0.0.1";

    error ArrayLengthsDiffer();
    error NotOwner();

    event URI(string _value, uint256 indexed _id);

    /**
     * @dev Creates a new token type
     * NOTE: remove onlyOwner if you want third parties to create new tokens on your contract (which may change your IDs)
     * @param _tokenData The token data.
     * @return _id The newly created token ID
     */
    function create(ERC1155Storage.TokenStructure memory _tokenData) internal returns (uint256 _id) {
        if (msg.sender != OwnableStorage.layout().owner) revert NotOwner();

        ERC1155Storage.Layout storage s = ERC1155Storage.layout();
        _id = s.currentTokenId;

        if (_tokenData.creator == address(0)) _tokenData.creator = msg.sender;

        s.tokenData[_id] = _tokenData;

        _incrementTokenTypeId();

        if (bytes(_tokenData.tokenUri).length > 0) emit URI(_tokenData.tokenUri, _id);
    }

    /**
     * @dev Creates a new token types in batch (with different settings)
     * NOTE: remove onlyOwner if you want third parties to create new tokens on your contract (which may change your IDs)
     * @param _amount Amount of new token to create with these settings.
     * @param _tokenData The token data.
     * @return success Bool of success
     */
    function batchCreate(
        uint256 _amount,
        ERC1155Storage.TokenStructure memory _tokenData
    ) internal returns (bool success) {
        if (msg.sender != OwnableStorage.layout().owner) revert NotOwner();

        ERC1155Storage.Layout storage s = ERC1155Storage.layout();

        if (_tokenData.creator == address(0)) _tokenData.creator = msg.sender;

        uint256 i;
        uint256 _id;
        for (; i < _amount; ) {
            _id = s.currentTokenId;

            s.tokenData[_id] = _tokenData;

            if (bytes(_tokenData.tokenUri).length > 0) emit URI(_tokenData.tokenUri, _id);

            _incrementTokenTypeId();
            ++i;
        }

        success = true;
    }

    /**
     * @dev Creates a new token types in batch
     * NOTE: remove onlyOwner if you want third parties to create new tokens on your contract (which may change your IDs)
     * @param _tokenData The token data.
     * @return success True if the batch creation was successful.
     */
    function batchCreate(ERC1155Storage.TokenStructure[] calldata _tokenData) internal returns (bool success) {
        if (msg.sender != OwnableStorage.layout().owner) revert NotOwner();

        ERC1155Storage.Layout storage s = ERC1155Storage.layout();

        uint256 i;
        uint256 _id;
        uint256 amount = _tokenData.length;
        for (; i < amount; ) {
            _id = s.currentTokenId;

            s.tokenData[_id] = _tokenData[i];

            if (_tokenData[i].creator == address(0)) s.tokenData[_id].creator = msg.sender;

            if (bytes(_tokenData[i].tokenUri).length > 0) emit URI(_tokenData[i].tokenUri, _id);

            _incrementTokenTypeId();

            ++i;
        }

        success = true;
    }

    function _incrementTokenTypeId() internal {
        unchecked {
            ++ERC1155Storage.layout().currentTokenId;
        }
    }
}
