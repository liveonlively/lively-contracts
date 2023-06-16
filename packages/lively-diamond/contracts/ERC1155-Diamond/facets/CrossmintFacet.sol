// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { CoinSwapper } from "../../shared/libraries/CoinSwapper.sol";
import { ISolidStateERC20 } from "@solidstate/contracts/token/ERC20/ISolidStateERC20.sol";
import { ERC1155, ERC1155Storage, OwnableStorage } from "../abstracts/ERC1155.sol";
import { LibDiamond } from "../../shared/libraries/LibDiamond.sol";
import { ERC1155Facet } from "./ERC1155Facet.sol";

contract CrossmintFacet is ERC1155 {
    string private constant CONTRACT_VERSION = "0.0.1";

    ISolidStateERC20 private immutable usdc;

    error NotCrossmintUSDCToken();

    constructor() payable {
        usdc = ISolidStateERC20(CoinSwapper.getUSDCAddress());
    }

    function mint(address account, uint256 id, uint256 amount, MintType mintType) external {
        // if (mintType == MintType.SINGLE) {
        //     ERC1155Facet(address(this)).mint{value: msg.value}(
        //         account,
        //         id,
        //         amount
        //     );
        // } else if (mintType == MintType.PACK) {
        //     ERC1155Facet(address(this)).packMint.mint{value: msg.value}(
        //         account,
        //         id,
        //         amount
        //     );
        // } else

        if (mintType == MintType.CROSSMINT_USDC_SINGLE) {
            crossmintMint(account, id, amount);
        } else if (mintType == MintType.CROSSMINT_USDC_PACK) {
            crossmintPackMint(account, id, amount);
        } else {
            revert InvalidMintType();
        }
    }

    function crossmintMint(
        address account,
        uint256 id,
        uint256 amount
    ) public validTokenID(id) validQuantity(id, amount) validTime(id, amount) {
        ERC1155Storage.TokenStructure memory l = ERC1155Storage.layout().tokenData[id];
        if (!l.isCrossmintUSDC) revert NotCrossmintUSDCToken();

        usdc.transferFrom(msg.sender, address(this), l.price * amount * 10 ** 4);

        _mint(account, id, amount, "");
    }

    function crossmintPackMint(address account, uint256 packId, uint256 amount) public {
        ERC1155Storage.Layout storage l = ERC1155Storage.layout();
        ERC1155Storage.PackStructure storage pack = l.packData[packId];

        uint256 batchLength = pack.tokenIds.length;
        uint256[] memory amounts = new uint256[](batchLength);

        // Check valid quantity TODO: Move to modifier
        uint256 i;
        uint256 tokenId;
        uint256 tokensMaxSupply;
        for (; i < batchLength; ++i) {
            tokenId = pack.tokenIds[i];
            tokensMaxSupply = l.tokenData[tokenId].maxSupply;

            if (tokensMaxSupply > 0)
                if (_totalSupply(tokenId) + amount > tokensMaxSupply) revert ExceedsMaxSupply();
        }

        // Check batch start time TODO: Move to modifier
        if (msg.sender != OwnableStorage.layout().owner) {
            if (block.timestamp < pack.startTime) revert MintNotOpen();
        }

        // Build amounts array
        for (i = 0; i < batchLength; ) {
            amounts[i] = amount;
            ++i;
        }

        // Price check not necessary as this will fail if msg.sender has not authorized enough USDC
        usdc.transferFrom(msg.sender, address(this), pack.price * amount * 10 ** 4);

        _mintBatch(account, pack.tokenIds, amounts, "");
    }
}
