// SPDX-License-Identifier: MIT
// ERC721A Contracts v4.2.2
// Creator: Lively modified from Chiru Labs (https://github.com/chiru-labs/ERC721A)

pragma solidity ^0.8.18;

import { Shared } from "../libraries/Shared.sol";
import { ERC721A } from "../abstracts/ERC721A.sol";
import { PausableInternal } from "@solidstate/contracts/security/pausable/PausableInternal.sol";
import { AllowList } from "../../shared/utils/AllowList/AllowList.sol";
import { LibDiamond } from "../../shared/libraries/LibDiamond.sol";
import { ERC721ALib } from "../libraries/ERC721ALib.sol";
import { CoinSwapper } from "../../shared/libraries/CoinSwapper.sol";
import { PriceConsumer } from "../../shared/libraries/PriceConsumer.sol";
import { AllowListInternal, AllowListStorage } from "../../shared/utils/AllowList/AllowListInternal.sol";
import { OwnableInternal } from "@solidstate/contracts/access/ownable/Ownable.sol";
import { OwnableStorage } from "@solidstate/contracts/access/ownable/OwnableStorage.sol";
import { ERC721AStorage } from "../utils/ERC721A/ERC721AStorage.sol";
import { EditionsStorage } from "../utils/Editions/EditionsStorage.sol";
import { PaymentSplitterStorage } from "../../shared/utils/PaymentSplitter/PaymentSplitterStorage.sol";

/**
 * @title ERC721A
 *
 * @dev Implementation of the [ERC721](https://eips.ethereum.org/EIPS/eip-721)
 * Non-Fungible Token Standard, including the Metadata extension.
 * Optimized for lower gas during batch mints.
 *
 * Token IDs are minted in sequential order (e.g. 0, 1, 2, 3, ...)
 * starting from `_startTokenId()`.
 *
 * Assumptions:
 *
 * - An owner cannot have more than 2**64 - 1 (max value of uint64) of supply.
 * - The maximum token ID cannot exceed 2**256 - 1 (max value of uint256).
 */
contract ERC721AFacet is ERC721A, AllowListInternal, OwnableInternal {
    string private constant CONTRACT_VERSION = "0.0.1";

    uint256 constant MAX_UINT256 = type(uint256).max;
    uint64 constant MAX_UINT64 = type(uint64).max;

    // =============================================================
    //                           Mint functions
    // =============================================================

    modifier mintChecks(address to) {
        AllowListStorage.Layout storage als = AllowListStorage.layout();
        EditionsStorage.Layout storage es = EditionsStorage.layout();

        if (als.allowListEnabled[0]) require(isAllowListed(0, msg.sender), "Not in allowlist");
        if (es.editionsEnabled) revert EditionsEnabled();

        _;
    }

    function mint(address to) external payable mintChecks(to) whenNotPaused {
        _mintApproved(to, 1);
    }

    function mint(address to, uint256 amount) external payable mintChecks(to) whenNotPaused {
        _mintApproved(to, amount);
    }

    // Minting is allowed, do checks against set limits
    function _mintApproved(address to, uint256 amount) internal whenNotPaused {
        ERC721AStorage.Layout storage s = ERC721AStorage.layout();
        PaymentSplitterStorage.Layout storage pss = PaymentSplitterStorage.layout();

        quantityCheck(to, amount);
        s.airdrop ? airdropCheck() : priceCheck(amount);

        emit Shared.PaymentReceived(msg.sender, msg.value);

        // If conversion is automatically enabled then convert the ETH to USD
        if (pss.automaticUSDConversion) {
            CoinSwapper.convertEthToUSDC();
        }

        ERC721ALib._mint(to, amount);
    }

    // =============================================================
    //                    Check functions
    // =============================================================
    function quantityCheck(address to, uint256 amount) private view {
        ERC721AStorage.Layout storage s = ERC721AStorage.layout();

        unchecked {
            if ((s.currentIndex + amount) > maxSupply()) revert ExceedsMaxSupply();

            if (ERC721ALib._numberMinted(to) + amount > maxMintPerAddress()) revert ExceedsMaxMintPerAddress();

            if (amount > maxMintPerTx()) revert ExceedsMaxMintPerTx();
        }
    }

    function airdropCheck() private view {
        if (msg.sender != OwnableStorage.layout().owner) revert InvalidAirdropCaller();
    }

    function priceCheck(uint256 amount) private {
        if (msg.value < (amount * price())) revert InvalidValueSent();
    }

    // =============================================================
    //                        Getters
    // =============================================================
    function airdrop() public view returns (bool) {
        ERC721AStorage.Layout storage s = ERC721AStorage.layout();

        return s.airdrop;
    }

    function maxMintPerTx() public view returns (uint256) {
        ERC721AStorage.Layout storage s = ERC721AStorage.layout();

        return s.maxMintPerTx == 0 ? MAX_UINT256 : s.maxMintPerTx;
    }

    function maxMintPerAddress() public view returns (uint256) {
        ERC721AStorage.Layout storage s = ERC721AStorage.layout();

        return s.maxMintPerAddress == 0 ? MAX_UINT64 : s.maxMintPerAddress;
    }

    function maxSupply() public view returns (uint256) {
        ERC721AStorage.Layout storage s = ERC721AStorage.layout();

        return s.maxSupply == 0 ? MAX_UINT256 : s.maxSupply;
    }

    function price() public view returns (uint256) {
        ERC721AStorage.Layout storage s = ERC721AStorage.layout();
        PaymentSplitterStorage.Layout storage pss = PaymentSplitterStorage.layout();

        return pss.isPriceUSD ? PriceConsumer.convertUSDtoWei(s.price) : s.price;
    }

    function isSoulbound() external view returns (bool) {
        ERC721AStorage.Layout storage s = ERC721AStorage.layout();

        return s.isSoulbound;
    }

    // =============================================================
    //                        Setters
    // =============================================================
    function setName(string calldata _name) external onlyOwner {
        ERC721AStorage.Layout storage s = ERC721AStorage.layout();

        s.name = _name;
    }

    function setSymbol(string calldata _symbol) external onlyOwner {
        ERC721AStorage.Layout storage s = ERC721AStorage.layout();

        s.symbol = _symbol;
    }

    function setTokenURI(string calldata tokenURI) external onlyOwner {
        ERC721AStorage.Layout storage s = ERC721AStorage.layout();

        s.baseTokenUri = tokenURI;
    }

    function setPrice(uint256 _price) external onlyOwner {
        ERC721AStorage.Layout storage s = ERC721AStorage.layout();

        s.price = _price;
    }

    function setAirdrop(bool _airdrop) external onlyOwner {
        ERC721AStorage.Layout storage s = ERC721AStorage.layout();

        s.airdrop = _airdrop;
    }

    function setMaxMintPerTx(uint256 _maxMintPerTx) external onlyOwner {
        ERC721AStorage.Layout storage s = ERC721AStorage.layout();

        s.maxMintPerTx = _maxMintPerTx;
    }

    function setMaxMintPerAddress(uint256 _maxMintPerAddress) external onlyOwner {
        ERC721AStorage.Layout storage s = ERC721AStorage.layout();

        s.maxMintPerAddress = _maxMintPerAddress;
    }

    function setMaxSupply(uint256 _maxSupply) external onlyOwner {
        ERC721AStorage.Layout storage s = ERC721AStorage.layout();

        s.maxSupply = _maxSupply;
    }

    function setIsPriceUSD(bool _isPriceUSD) external onlyOwner {
        PaymentSplitterStorage.Layout storage pss = PaymentSplitterStorage.layout();

        pss.isPriceUSD = _isPriceUSD;
    }

    function setAutomaticUSDConversion(bool _automaticUSDConversion) external onlyOwner {
        PaymentSplitterStorage.Layout storage pss = PaymentSplitterStorage.layout();

        pss.automaticUSDConversion = _automaticUSDConversion;
    }

    function setSoulbound(bool _isSoulbound) external onlyOwner {
        ERC721AStorage.Layout storage s = ERC721AStorage.layout();

        s.isSoulbound = _isSoulbound;
    }

    // =============================================================
    //                        Other
    // =============================================================
    function burn(uint256 tokenId) public onlyOwner {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        _burn(tokenId, false);

        // Call Royalty Burn

        /** Type safe and more explicity example */
        // RoyaltyFacet(address(this)).royaltyBurn(tokenId);

        /** @dev Gas efficient example, needs testing. If it doesn't work the simpler above way will. */
        bytes4 functionSelector = bytes4(keccak256("royaltyBurn(uint256)"));
        // get facet address of function
        address facet = address(bytes20(ds.facets[functionSelector]));

        bytes memory myFunctionCall = abi.encodeWithSelector(functionSelector, tokenId);
        (bool success, ) = address(facet).delegatecall(myFunctionCall);

        require(success, "myFunction failed");
    }
}
