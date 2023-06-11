// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {ERC721AFacet} from "./ERC721AFacet.sol";
import {ERC721ALib} from "../libraries/ERC721ALib.sol";
import {ArrayUtils} from "../../shared/libraries/ArrayUtils.sol";
import {IQueryableFacet} from "../interfaces/IQueryableFacet.sol";
import {ERC721AQueryable} from "../abstracts/ERC721AQueryable.sol";

import {ERC721AStorage} from "../utils/ERC721A/ERC721AStorage.sol";
import {EditionsStorage} from "../utils/Editions/EditionsStorage.sol";

/**
 * @dev Queryable facet for Lively diamond contracs.
 * @author https://github.com/lively
 */
contract QueryableFacet is ERC721AQueryable, IQueryableFacet {
    string private constant CONTRACT_VERSION = "0.0.1";

    /**
     * @dev Get the editionIndex or a given tokenId
     * @param _tokenId The tokenId to check
     * @return The editionIndex
     */
    function getEditionIndex(uint256 _tokenId) external view returns (uint256) {
        EditionsStorage.Layout storage es = EditionsStorage.layout();

        if (!es.editionsEnabled) {
            revert EditionsDisabled();
        }
        return ERC721ALib._ownershipOf(_tokenId).extraData;
    }

    /**
     * @dev Get all the current owners of the collection
     * @return Array of addresses
     */
    function getOwners() external view override returns (address[] memory) {
        ERC721AStorage.Layout storage s = ERC721AStorage.layout();

        address[] memory owners = new address[](s.currentIndex);
        uint256 tokenIndexLength = s.currentIndex;
        uint256 i; // Defaults to 0
        uint256 curr; // Defaults to 0
        uint256 packed; // Defaults to 0
        unchecked {
            for (; i < tokenIndexLength; ) {
                curr = i;
                packed = s.packedOwnerships[curr];

                // If not burned.
                if (packed & ERC721ALib._BITMASK_BURNED == 0) {
                    // Invariant:
                    // There will always be an initialized ownership slot
                    // (i.e. `ownership.addr != address(0) && ownership.burned == false`)
                    // before an unintialized ownership slot
                    // (i.e. `ownership.addr == address(0) && ownership.burned == false`)
                    // Hence, `curr` will not underflow.
                    //
                    // We can directly compare the packed value.
                    // If the address is zero, packed will be zero.
                    while (packed == 0) {
                        packed = s.packedOwnerships[--curr];
                    }
                    owners[i] = address(uint160(packed));
                }
                ++i;
            }
        }
        return owners;
    }

    /**
     * @dev Get all current owners of a specific edition in the collection
     * @param _editionIndex The edition index to check
     * @return Array of addresses
     */
    function getOwners(
        uint256 _editionIndex
    ) external view override returns (address[] memory) {
        ERC721AStorage.Layout storage s = ERC721AStorage.layout();

        address[] memory owners = new address[](s.currentIndex);
        uint256 tokenIndexLength = s.currentIndex;
        uint256 i; // Defaults to 0
        uint256 curr; // Defaults to 0
        uint256 packed; // Defaults to 0
        unchecked {
            for (; i < tokenIndexLength; ) {
                curr = i;
                packed = s.packedOwnerships[curr];

                // If not burned.
                if (packed & ERC721ALib._BITMASK_BURNED == 0) {
                    // Invariant:
                    // There will always be an initialized ownership slot
                    // (i.e. `ownership.addr != address(0) && ownership.burned == false`)
                    // before an unintialized ownership slot
                    // (i.e. `ownership.addr == address(0) && ownership.burned == false`)
                    // Hence, `curr` will not underflow.
                    //
                    // We can directly compare the packed value.
                    // If the address is zero, packed will be zero.
                    while (packed == 0) {
                        packed = s.packedOwnerships[--curr];
                    }
                    if (
                        ERC721ALib._ownershipOf(curr).extraData == _editionIndex
                    ) {
                        owners[i] = address(uint160(packed));
                    }
                }
                ++i;
            }
        }

        return owners;
    }

    /**
     * @dev Get all tokens owned by a given address
     * @param _owner Address of the owner
     * @return Array of token IDs
     */
    function getTokensByOwner(
        address _owner
    ) external view override returns (uint256[] memory) {
        return tokensOfOwner(_owner);
    }

    /**
     * @dev Get all tokens owned by given address for a specific edition
     * @param _owner Address of the owner
     * @param _editionIndex Edition index
     * @return Array of token IDs
     */
    function getTokensByOwner(
        address _owner,
        uint256 _editionIndex
    ) public view override returns (uint256[] memory) {
        uint256[] memory allTokensOwned = tokensOfOwner(_owner);
        uint256 tokenIdsLength = allTokensOwned.length;
        uint256[] memory editionTokens;
        uint256 i = 0;

        unchecked {
            for (; i < tokenIdsLength; ) {
                if (
                    ERC721ALib._ownershipOf(allTokensOwned[i]).extraData ==
                    _editionIndex
                ) {
                    editionTokens = ArrayUtils.append(
                        editionTokens,
                        allTokensOwned[i]
                    );
                }
                ++i;
            }
        }

        return editionTokens;
    }

    /**
     * @dev Get all editions owned  by a specific address
     * @param _owner Address of the owner
     * @return Array of edition indexes
     */
    function getEditionsByOwner(
        address _owner
    ) external view override returns (uint256[] memory) {
        uint256[] memory allTokensOwned = tokensOfOwner(_owner);
        uint256[] memory editions = new uint256[](0);

        unchecked {
            uint256 i = 0;
            uint256 edition;
            uint256 tokenIdsLength = allTokensOwned.length;
            for (; i < tokenIdsLength; ) {
                edition = ERC721ALib._ownershipOf(allTokensOwned[i]).extraData;
                if (!ArrayUtils.includes(editions, edition)) {
                    editions = ArrayUtils.append(editions, edition);
                }

                ++i;
            }
        }

        return editions;
    }

    function ownsEdition(
        address _owner,
        uint256 editionIndex
    ) external view override returns (bool) {
        uint256[] memory ownedEditions = getTokensByOwner(_owner, editionIndex);
        return ownedEditions.length > 0;
    }
}
