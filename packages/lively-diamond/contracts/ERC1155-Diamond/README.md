# Lively 1155 Diamond Contract

This is a gas optimized diamond contract based off of [diamond-2-hardhat](https://github.com/mudgen/diamond-2-hardhat)
by Nick Mudgen. Multiple types of tokens can be minted directly from this singular contract.

## TODO

- [ ] Build out docs

## Features

- [x] Base 1155 implementation
- [x] Multiple editions
- [ ] Allowlist merkle tree per edition
- [x] Ownership
- [ ] Role-based modifiers
- [x] Pausability
- [x] Payment splitting
- [ ] Secondary sale royalties (contractUri and EIP-2981)

## Testing Goals

- [ ] Create contract factory to deploy new versions of Diamond
- [ ] On chain metadata with gas comparisons
