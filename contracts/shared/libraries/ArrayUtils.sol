// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

library ArrayUtils {
    string private constant CONTRACT_VERSION = "0.0.1";

    // Check to see if array includes given address
    function includes(address[] memory _array, address _address) internal pure returns (bool) {
        unchecked {
            uint256 i = 0;
            uint256 arrayLength = _array.length;
            for (; i < arrayLength; ) {
                if (_array[i] == _address) {
                    return true;
                }
                ++i;
            }
        }

        return false;
    }

    // Check to see if array includes given uint256
    function includes(uint256[] memory _array, uint256 _tokenIndex) internal pure returns (bool) {
        //
        uint256 i = 0;
        uint256 arrayLength = _array.length;
        for (; i < arrayLength; ) {
            if (_array[i] == _tokenIndex) {
                return true;
            }
            ++i;
        }
        // }

        return false;
    }

    // Append item to array for uint256
    function append(uint256[] memory _array, uint256 _tokenIndex) internal pure returns (uint256[] memory) {
        unchecked {
            uint256 arrayLength = _array.length;
            uint256[] memory newArray = new uint256[](arrayLength + 1);
            uint256 i = 0;
            for (; i < arrayLength; ) {
                newArray[i] = _array[i];
                ++i;
            }
            newArray[i] = _tokenIndex;
            return newArray;
        }
    }

    // Append item to array for address
    function append(address[] memory _array, address _address) internal pure returns (address[] memory) {
        unchecked {
            uint256 arrayLength = _array.length;
            address[] memory newArray = new address[](arrayLength + 1);
            uint256 i = 0;
            for (; i < arrayLength; ) {
                newArray[i] = _array[i];
                ++i;
            }
            newArray[i] = _address;
            return newArray;
        }
    }
}
