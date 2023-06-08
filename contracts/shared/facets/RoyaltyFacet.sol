// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts (last updated v4.5.0) (token/ERC721/extensions/ERC721Royalty.sol)

pragma solidity ^0.8.18;

import { RoyaltiesStorage } from "../utils/Royalties/RoyaltiesStorage.sol";
import { ERC2981 } from "@solidstate/contracts/token/common/ERC2981/ERC2981.sol";
import { OwnableInternal } from "@solidstate/contracts/access/ownable/OwnableInternal.sol";
import { ERC2981Storage } from "@solidstate/contracts/token/common/ERC2981/ERC2981Storage.sol";

contract RoyaltyFacet is ERC2981, OwnableInternal {
    string private constant CONTRACT_VERSION = "0.0.1";

    function setDefaultRoyalty(uint16 _defaultRoyaltyBPS, address _defaultRoyalyReceiver) external onlyOwner {
        ERC2981Storage.layout().defaultRoyaltyBPS = _defaultRoyaltyBPS;
        ERC2981Storage.layout().defaultRoyaltyReceiver = _defaultRoyalyReceiver;
    }

    function contractURI() public view returns (string memory) {
        return RoyaltiesStorage.layout().contractURI;
    }

    /// @dev Will be ignored when adding this facet to the NFT diamond.
    function supportsInterface(bytes4 interfaceId) external view override returns (bool) {}
}
