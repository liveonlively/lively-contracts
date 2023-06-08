// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { MerkleProof } from "@solidstate/contracts/cryptography/MerkleProof.sol";

library AllowListLib {
    string private constant CONTRACT_VERSION = "0.0.1";

    bytes32 constant whitelistRootHash = 0xd28e8860b2ebd608c02124274c0d9988d526a48f7f6ac34b51edd7e187e04610;

    function validateMerkleProof(bytes32[] memory proofs) internal view returns (bool) {
        bytes32 leafNode = keccak256(abi.encodePacked(msg.sender));
        bool senderInAllowList = MerkleProof.verify(proofs, whitelistRootHash, leafNode);

        return senderInAllowList;
    }
}
