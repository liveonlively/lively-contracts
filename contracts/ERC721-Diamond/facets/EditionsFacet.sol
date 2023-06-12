// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import { PausableInternal } from "@solidstate/contracts/security/pausable/PausableInternal.sol";
import { LibDiamond } from "../../shared/libraries/LibDiamond.sol";
import { PriceConsumer } from "../../shared/libraries/PriceConsumer.sol";
import { CoinSwapper } from "../../shared/libraries/CoinSwapper.sol";
import { Shared } from "../libraries/Shared.sol";
import { ERC721ALib } from "../libraries/ERC721ALib.sol";
import { OwnableInternal } from "@solidstate/contracts/access/ownable/Ownable.sol";
import { ERC721AStorage } from "../utils/ERC721A/ERC721AStorage.sol";
import { EditionsStorage, Edition } from "../utils/Editions/EditionsStorage.sol";
import { PaymentSplitterStorage } from "../../shared/utils/PaymentSplitter/PaymentSplitterStorage.sol";

/**
 * Create editions for diamond ERC721A
 * @author https://github.com/lively
 */
contract EditionsFacet is PausableInternal, OwnableInternal {
    string private constant CONTRACT_VERSION = "0.0.1";

    uint256 constant MAX_UINT256 = type(uint256).max;
    uint64 constant MAX_UINT64 = type(uint64).max;

    error AlreadyMinted();
    error EditionsEnabled();
    error URIRequired();
    error EditionSoldOut();
    error InsufficientValue();
    error InvalidEditionId();
    error InvalidValueSent();
    error ExceedsMaxSupply();
    error ExceedsMaxMintPerAddress();
    error ExceedsMaxMintPerTx();
    error InvalidAirdropCaller();

    modifier validEdition(uint256 _editionIndex) {
        EditionsStorage.Layout storage es = EditionsStorage.layout();

        if (_editionIndex >= es.editionsByIndex.length) {
            revert InvalidEditionId();
        }

        _;
    }

    function createEdition(string calldata _name, uint256 _maxSupply, uint256 _price) public onlyOwner {
        Shared.createEdition(_name, _maxSupply, _price);
    }

    // Maybe don't want to allow editions to be disabled...
    function enableEditions() public onlyOwner {
        ERC721AStorage.Layout storage s = ERC721AStorage.layout();
        EditionsStorage.Layout storage es = EditionsStorage.layout();

        if (s.currentIndex != 0) revert AlreadyMinted();
        if (es.editionsEnabled) revert EditionsEnabled();

        // Set flag to true
        es.editionsEnabled = true;
        // Reset max supply, calculated based on editions
        s.maxSupply = 0;
    }

    // Mint for a specific edition
    function mint(
        address to,
        uint256 amount,
        uint256 editionIndex
    ) public payable whenNotPaused validEdition(editionIndex) {
        ERC721AStorage.Layout storage s = ERC721AStorage.layout();
        EditionsStorage.Layout storage es = EditionsStorage.layout();

        if (s.airdrop) airdropCheck();
        if (!es.editionsEnabled) revert Shared.EditionsDisabled();
        uint256 startToken = s.currentIndex;

        // Need to use storage to increment at end
        Edition storage _edition = es.editionsByIndex[editionIndex];

        // Check if edition is unlimited or if it would exceed supply
        unchecked {
            if (_edition.maxSupply > 0 && (_edition.totalSupply + amount) > _edition.maxSupply) {
                revert EditionSoldOut();
            }

            if (msg.value < (amount * price(editionIndex))) revert InsufficientValue();
        }

        // Mint the token
        _mintApproved(to, amount);

        // Set token edition
        // Next token ID is s.currentIndex;
        ERC721ALib._setExtraDataAt(startToken, uint24(editionIndex));

        // Increment the edition supply
        _edition.totalSupply += amount;
    }

    // Minting is allowed, do checks against set limits
    function _mintApproved(address to, uint256 quantity) internal whenNotPaused {
        PaymentSplitterStorage.Layout storage pss = PaymentSplitterStorage.layout();

        emit Shared.PaymentReceived(msg.sender, msg.value);

        // If conversion is automatically enabled then convert the ETH to USD
        if (pss.automaticUSDConversion) {
            CoinSwapper.convertEthToUSDC();
        }

        ERC721ALib._mint(to, quantity);
    }

    // =============================================================
    //                    Check functions
    // =============================================================

    function airdropCheck() private view {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();

        if (msg.sender != ds.contractOwner) revert InvalidAirdropCaller();
    }

    // =============================================================
    //                        Getters
    // =============================================================
    function price(uint256 _editionIndex) public view returns (uint256) {
        EditionsStorage.Layout storage es = EditionsStorage.layout();
        PaymentSplitterStorage.Layout storage pss = PaymentSplitterStorage.layout();

        Edition memory edition = es.editionsByIndex[_editionIndex];
        return pss.isPriceUSD ? PriceConsumer.convertUSDtoWei(edition.price) : edition.price;
    }

    function maxSupply(uint256 _editionIndex) public view validEdition(_editionIndex) returns (uint256) {
        EditionsStorage.Layout storage es = EditionsStorage.layout();

        return es.editionsByIndex[_editionIndex].maxSupply;
    }

    function totalSupply(uint256 _editionIndex) public view validEdition(_editionIndex) returns (uint256) {
        EditionsStorage.Layout storage es = EditionsStorage.layout();

        return es.editionsByIndex[_editionIndex].totalSupply;
    }

    // =============================================================
    //                        Setters
    // =============================================================
    function setPrice(uint256 _price, uint256 _editionIndex) external onlyOwner validEdition(_editionIndex) {
        EditionsStorage.Layout storage es = EditionsStorage.layout();

        es.editionsByIndex[_editionIndex].price = _price;
    }

    function setMaxSupply(uint256 _maxSupply, uint256 _editionIndex) external onlyOwner validEdition(_editionIndex) {
        EditionsStorage.Layout storage es = EditionsStorage.layout();
        Edition storage _edition = es.editionsByIndex[_editionIndex];

        require(_edition.totalSupply <= _maxSupply, "Cannot set max supply lower than current supply");
        _edition.maxSupply = _maxSupply;
    }

    function updateTotalSupply(
        uint256 _totalSuppy,
        uint256 _editionIndex
    ) public onlyOwner validEdition(_editionIndex) {
        EditionsStorage.Layout storage es = EditionsStorage.layout();

        es.editionsByIndex[_editionIndex].totalSupply = _totalSuppy;
    }
}
