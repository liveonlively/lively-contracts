// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { IERC1155Facet } from "../interfaces/IERC1155Facet.sol";
import { ERC1155Storage } from "../utils/ERC1155/ERC1155Storage.sol";
import { ERC1155Lib } from "../libraries/ERC1155Lib.sol";
import { PriceConsumer } from "../../shared/libraries/PriceConsumer.sol";
import { IERC1155 } from "@solidstate/contracts/interfaces/IERC1155.sol";
import { EnumerableSet } from "@solidstate/contracts/data/EnumerableSet.sol";
import { CoinSwapper } from "../../shared/libraries/CoinSwapper.sol";
import { OwnableInternal } from "@solidstate/contracts/access/ownable/Ownable.sol";
import { PausableInternal } from "@solidstate/contracts/security/pausable/PausableInternal.sol";
import { MetadataInternal, MetadataStorage } from "../utils/Metadata/MetadataInternal.sol";
import { DefaultOperatorFilterer } from "operator-filter-registry/src/DefaultOperatorFilterer.sol";
import { ERC1155BaseStorage } from "@solidstate/contracts/token/ERC1155/base/ERC1155BaseStorage.sol";
import { IERC1155Metadata } from "@solidstate/contracts/token/ERC1155/metadata/IERC1155Metadata.sol";
import { ERC1155MetadataStorage } from "@solidstate/contracts/token/ERC1155/metadata/ERC1155MetadataStorage.sol";
import { ERC1155EnumerableStorage } from "@solidstate/contracts/token/ERC1155/enumerable/ERC1155EnumerableStorage.sol";
import {
    SolidStateERC1155,
    ERC1155Base,
    ERC1155Metadata
} from "@solidstate/contracts/token/ERC1155/SolidStateERC1155.sol";
import { AllowListStorage, AllowListInternal } from "../../shared/utils/AllowList/AllowListInternal.sol";
import { ERC1155 } from "../abstracts/ERC1155.sol";

contract ERC1155Facet is OwnableInternal, DefaultOperatorFilterer, ERC1155 {
    string private constant CONTRACT_VERSION = "0.0.1";

    using EnumerableSet for EnumerableSet.UintSet;
    using ERC1155Storage for ERC1155Storage.Layout;
    using EnumerableSet for EnumerableSet.AddressSet;
    using MetadataStorage for MetadataStorage.Layout;
    using ERC1155MetadataStorage for ERC1155MetadataStorage.Layout;
    using ERC1155EnumerableStorage for ERC1155EnumerableStorage.Layout;

    /// Checks if valid value was sent.
    /// @notice Checks if the amount sent is greater than or equal to the price of the token. If the sender is the owner, it will bypass this check allowing the owner to mint or airdrop for free.
    /// @param _id The token ID
    /// @param _amount The amount of tokens being minted
    modifier validValueSent(uint256 _id, uint256 _amount) {
        uint256 totalPrice = price(_id) * _amount;

        if (msg.sender != _owner())
            if (msg.value < totalPrice) revert InvalidAmount();

        _;
    }

    /// Mint a batch of tokens.
    function packMint(address account, uint256 packId, uint256 amount) public payable {
        ERC1155Storage.Layout storage l = ERC1155Storage.layout();
        ERC1155Storage.PackStructure storage pack = l.packData[packId];

        uint256 batchLength = pack.tokenIds.length;
        uint256[] memory amounts = new uint256[](batchLength);

        uint256 i;
        for (; i < batchLength; ) {
            amounts[i] = amount;
            ++i;
        }

        // Check valid quantity TODO: Move to modifier
        uint256 tokenId;
        uint256 tokensMaxSupply;
        for (i = 0; i < batchLength; ++i) {
            tokenId = pack.tokenIds[i];
            tokensMaxSupply = l.tokenData[tokenId].maxSupply;

            if (tokensMaxSupply > 0)
                if (_totalSupply(tokenId) + amount > tokensMaxSupply) revert ExceedsMaxSupply();
        }

        // Check price TODO: Move to modifier
        uint256 totalPrice = pack.price * amount;
        if (msg.sender != _owner())
            if (msg.value < totalPrice) revert InvalidAmount();

        // Check batch start time TODO: Move to modifier
        if (msg.sender != _owner()) {
            if (pack.startTime > block.timestamp) revert MintNotOpen();
        }

        _mintBatch(account, pack.tokenIds, amounts, "");

        emit PaymentReceived(msg.sender, msg.value);

        if (ERC1155Storage.layout().automaticUSDConversion) {
            CoinSwapper.convertEthToUSDC();
        }
    }

    function packCreate(uint256[] calldata _tokenIds, uint256 _price, uint256 _startTime) external onlyOwner {
        ERC1155Storage.Layout storage l = ERC1155Storage.layout();

        uint256 currentPackId = l.getCurrentPackId();
        l.packData[currentPackId] = ERC1155Storage.PackStructure(_price, _startTime, _tokenIds);
        l.incrementPackId();
    }

    /// Get price for a pack
    function packPrice(uint256 _packId) external view returns (uint256) {
        return ERC1155Storage.layout().packData[_packId].price;
    }

    /// Get startTime for a pack
    function packStartTime(uint256 _packId) external view returns (uint256) {
        return ERC1155Storage.layout().packData[_packId].startTime;
    }

    /// Get tokenIds for a pack
    function packTokenIds(uint256 _packId) external view returns (uint256[] memory) {
        return ERC1155Storage.layout().packData[_packId].tokenIds;
    }

    function mint(
        address account,
        uint256 id,
        uint256 amount
    ) external payable validTime(id, amount) validTokenID(id) validQuantity(id, amount) validValueSent(id, amount) {
        _mint(account, id, amount, "");
        emit PaymentReceived(msg.sender, msg.value);

        if (ERC1155Storage.layout().automaticUSDConversion) {
            CoinSwapper.convertEthToUSDC();
        }
    }

    /// Mint function used by owner for airdrops.
    /// @notice Mints to multiple accounts at once, used by owner for airdrops.
    /// @param accounts Array of accounts to send to.
    /// @param id ID of token to airdrop.
    /// @param amount The amount of tokens being minted to each account.
    function mint(
        address[] calldata accounts,
        uint256 id,
        uint256 amount
    ) external validTokenID(id) validQuantity(id, amount) onlyOwner {
        uint256 accountsLength = accounts.length;
        uint256 i;
        address to;
        ERC1155EnumerableStorage.Layout storage l = ERC1155EnumerableStorage.layout();
        ERC1155BaseStorage.Layout storage lb = ERC1155BaseStorage.layout();

        for (; i < accountsLength; ) {
            to = accounts[i];
            if (to == address(0)) revert ERC1155Base__MintToZeroAddress();

            if (lb.balances[id][to] == 0) {
                l.accountsByToken[id].add(to);
                l.tokensByAccount[to].add(id);
            }

            unchecked {
                l.totalSupply[id] += amount;
                lb.balances[id][to] += amount;
                ++i;
            }

            emit TransferSingle(msg.sender, address(0), to, id, amount);
        }
    }

    function uri(uint256 tokenId) public view override(ERC1155Metadata, IERC1155Metadata) returns (string memory) {
        string memory uniqueTokenURI = ERC1155Storage.layout().tokenData[tokenId].tokenUri;

        if (bytes(uniqueTokenURI).length > 0) {
            return uniqueTokenURI;
        }

        return string(abi.encodePacked(ERC1155MetadataStorage.layout().baseURI, _toString(tokenId)));
    }

    function maxSupply(uint256 _id) public view returns (uint256) {
        return ERC1155Storage.layout().tokenData[_id].maxSupply;
    }

    function setMaxSupply(uint256 _id, uint256 _maxSupply) external validTokenID(_id) onlyOwner {
        if (_maxSupply < totalSupply(_id)) revert InvalidMaxSupply();

        ERC1155Storage.layout().tokenData[_id].maxSupply = _maxSupply;
    }

    /// Creates a new token edition.
    /// @dev remove onlyOwner if you want third parties to create new tokens on your contract (which may change your IDs)
    /// @param _tokenData The token data
    /// @return _id The newly created token ID
    function create(ERC1155Storage.TokenStructure memory _tokenData) public onlyOwner returns (uint256 _id) {
        _id = ERC1155Lib.create(_tokenData);
    }

    /// Creates a new token editions in one transaction. All editions will have the same settings.
    /// If you need individual settings (diffrent URIs, prices, etc), use the other batchCreate function.
    /// @dev remove onlyOwner if you want third parties to create new tokens on your contract (which may change your IDs)
    /// @param _amount Amount of new token to create with these settings.
    /// @param _tokenData The token data
    /// @return success Whether or not the batch creation was successful.
    function batchCreate(
        uint256 _amount,
        ERC1155Storage.TokenStructure calldata _tokenData
    ) external onlyOwner returns (bool success) {
        success = ERC1155Lib.batchCreate(_amount, _tokenData);
    }

    /// Creates a set of new editions in one transaction.
    /// Editions are passed as an array so this is useful if they require very different settings.
    /// If they're all similar, using the other batchCreate function might be easier.
    /// @dev remove onlyOwner if you want third parties to create new tokens on your contract (which may change your IDs)
    /// @param _tokenData The token data
    /// @return success Bool of success
    function batchCreate(
        ERC1155Storage.TokenStructure[] calldata _tokenData
    ) external onlyOwner returns (bool success) {
        success = ERC1155Lib.batchCreate(_tokenData);
    }

    /// @dev Returns whether the specified token exists by checking to see if it has a creator
    /// @param _tokenId uint256 ID of the token to query the existence of
    /// @return bool whether the token exists
    function exists(uint256 _tokenId) external view returns (bool) {
        return _exists(_tokenId);
    }

    function _exists(uint256 _id) internal view returns (bool) {
        return ERC1155Storage.layout().tokenData[_id].creator != address(0);
    }

    /// @dev calculates the next token ID based on value of _currentTokenID
    /// @return uint256 for the next token ID
    function _getNextTokenID() private view returns (uint256) {
        unchecked {
            return ERC1155Storage.layout().currentTokenId + 1;
        }
    }

    /// @dev increments the value of _currentTokenID
    function _incrementTokenTypeId() private {
        unchecked {
            ++ERC1155Storage.layout().currentTokenId;
        }
    }

    function burn(address account, uint256 id, uint256 amount) external validTokenID(id) onlyOwner {
        _burn(account, id, amount);
    }

    /// @dev Pause beforeTransfer for security
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    /// OpenSea Compliance
    function setApprovalForAll(
        address operator,
        bool status
    ) public override(ERC1155Base, IERC1155) onlyAllowedOperatorApproval(operator) {
        super.setApprovalForAll(operator, status);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id, // tokenId
        uint256 amount,
        bytes memory data
    ) public override(ERC1155Base, IERC1155) onlyAllowedOperator(from) {
        super.safeTransferFrom(from, to, id, amount, data);
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public virtual override(ERC1155Base, IERC1155) onlyAllowedOperator(from) {
        super.safeBatchTransferFrom(from, to, ids, amounts, data);
    }

    /// @dev Converts a uint256 to its ASCII string decimal representation.
    function _toString(uint256 value) internal pure virtual returns (string memory str) {
        assembly {
            // The maximum value of a uint256 contains 78 digits (1 byte per digit),
            // but we allocate 0x80 bytes to keep the free memory pointer 32-byte word aligned.
            // We will need 1 32-byte word to store the length,
            // and 3 32-byte words to store a maximum of 78 digits. Total: 0x20 + 3/// 0x20 = 0x80.
            str := add(mload(0x40), 0x80)
            // Update the free memory pointer to allocate.
            mstore(0x40, str)

            // Cache the end of the memory to calculate the length later.
            let end := str

            // We write the string from rightmost digit to leftmost digit.
            // The following is essentially a do-while loop that also handles the zero case.
            // prettier-ignore
            for { let temp := value } 1 {} {
                str := sub(str, 1)
                // Write the character to the pointer.
                // The ASCII index of the '0' character is 48.
                mstore8(str, add(48, mod(temp, 10)))
                // Keep dividing `temp` until zero.
                temp := div(temp, 10)
                // prettier-ignore
                if iszero(temp) { break }
            }

            let length := sub(end, str)
            // Move the pointer 32 bytes leftwards to make room for the length.
            str := sub(str, 0x20)
            // Store the length.
            mstore(str, length)
        }
    }

    /// Get price for certain edition
    function price(uint256 _id) public view validTokenID(_id) returns (uint256) {
        ERC1155Storage.Layout storage l = ERC1155Storage.layout();
        uint256 tokenPrice = l.tokenData[_id].price;

        return l.isPriceUSD ? PriceConsumer.convertUSDtoWei(tokenPrice) : tokenPrice;
    }

    /// Set price for certain edition
    function setPrice(uint256 _id, uint256 _price) external validTokenID(_id) onlyOwner {
        ERC1155Storage.layout().tokenData[_id].price = _price;
    }

    /// @dev Name/symbol needed for certain sites like OpenSea
    function name() public view returns (string memory) {
        return ERC1155Storage.layout().name;
    }

    function symbol() public view returns (string memory) {
        return ERC1155Storage.layout().symbol;
    }

    function setName(string calldata _name) external onlyOwner {
        ERC1155Storage.layout().name = _name;
    }

    function setSymbol(string calldata _symbol) external onlyOwner {
        ERC1155Storage.layout().symbol = _symbol;
    }

    /// Function to get the start time of a specific token
    function startTime(uint256 _id) external view validTokenID(_id) returns (uint256) {
        return ERC1155Storage.layout().tokenData[_id].startTime;
    }

    /// Function to change the start time of a specific token
    function setStartTime(uint256 _id, uint256 _startTime) external validTokenID(_id) onlyOwner {
        ERC1155Storage.layout().tokenData[_id].startTime = _startTime;
    }

    /// Get tokenData
    function tokenData(uint256 id) external view returns (ERC1155Storage.TokenStructure memory) {
        return ERC1155Storage.layout().tokenData[id];
    }

    /// Set tokenData
    function setTokenData(
        uint256 _id,
        ERC1155Storage.TokenStructure calldata _tokenData
    ) external validTokenID(_id) onlyOwner {
        ERC1155Storage.layout().tokenData[_id] = _tokenData;
    }
}
