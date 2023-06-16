// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { MerkleProof } from "@solidstate/contracts/cryptography/MerkleProof.sol";

library MerkleTreeLib {
    string private constant CONTRACT_VERSION = "0.0.1";

    function verify(bytes32[] memory proof, bytes32 root, bytes32 leaf) internal pure returns (bool) {
        return MerkleProof.verify(proof, root, leaf);
    }
}
