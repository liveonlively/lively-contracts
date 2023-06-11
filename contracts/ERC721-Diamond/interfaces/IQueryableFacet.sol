// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @dev Allow list Facet for updating AllowList Merkle Tree
 * @author https://github.com/lively
 */
interface IQueryableFacet {
    error EditionsDisabled();
    error InvalidEditionIndex();

    /// @notice Get the editionIndex or a given tokenId
    /// @param _tokenId The tokenId to check
    /// @return The editionIndex
    function getEditionIndex(uint256 _tokenId) external view returns (uint256);

    /// @notice Get all the current owners of the collection
    /// @return Array of addresses
    function getOwners() external view returns (address[] memory);

    /// @notice Get all current owners of a specific edition in the collection
    /// @param _editionIndex The edition index to check
    /// @return Array of addresses
    function getOwners(
        uint256 _editionIndex
    ) external view returns (address[] memory);

    /// @notice Get all tokens owned by a given address
    /// @param _owner Address of the owner
    /// @return Array of token IDs
    function getTokensByOwner(
        address _owner
    ) external view returns (uint256[] memory);

    /// @notice Get all tokens owned by given address for a specific edition
    /// @param _owner Address of the owner
    /// @param _editionIndex Edition index
    /// @return Array of token IDs
    function getTokensByOwner(
        address _owner,
        uint256 _editionIndex
    ) external view returns (uint256[] memory);

    /// @notice Get all editions owned  by a specific address
    /// @param _owner Address of the owner
    /// @return Array of edition indexes
    function getEditionsByOwner(
        address _owner
    ) external view returns (uint256[] memory);

    /// @notice Verifies if address owns an edition
    /// @param _owner Address of the owner
    /// @return True/false based on ownership
    function ownsEdition(
        address _owner,
        uint256 editionIndex
    ) external view returns (bool);
}
