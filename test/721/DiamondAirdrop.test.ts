/* eslint-disable @typescript-eslint/naming-convention */
import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";
import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { deploy, defaultArgs } from "../../scripts/deployDiamondVerify";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { DummyDiamond721Implementation } from "../../types";

export interface ERC721BaseContext {
  Contract: ContractFactory;
  contract: Contract;
  maxSupply: number;
  owner: SignerWithAddress;
  addr1: SignerWithAddress;
  addr2: SignerWithAddress;
  DEFAULT_ADMIN_ROLE: string;
  OWNER_ROLE: string;
}

describe(`DiamondAirdrop Test`, function () {
  async function deployTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners(); // ...addrs

    defaultArgs._baseTokenUri = "https://golive.ly/tokenuri/";
    defaultArgs._secondaryPayee = addr2.address;
    defaultArgs._airdrop = true;
    defaultArgs._isPriceUSD = false;
    defaultArgs._automaticUSDConversion = false;
    defaultArgs._maxSupply = 100;
    defaultArgs._maxMintPerAddress = 100;
    defaultArgs._maxMintPerTx = 100;

    const contractAddress = await deploy(defaultArgs, { verify: false });

    const contract = (await ethers.getContractAt(
      "DummyDiamond721Implementation",
      contractAddress,
      owner,
    )) as unknown as DummyDiamond721Implementation;

    const maxSupply = await contract["maxSupply()"]();

    return {
      owner,
      addr1,
      addr2,
      contract,
      maxSupply,
    };
  }

  describe("NFT Minting", function () {
    it("Non-owner should not be able to mint", async function () {
      const { addr1, contract } = await loadFixture(deployTokenFixture);
      // Mint a token as owner
      await expect(contract.connect(addr1)["mint(address)"](addr1.address)).to.be.reverted;

      // Total supply/balance of for address 1 should be 1
      expect(await contract.balanceOf(addr1.address)).to.equal(0);
      expect(await contract["totalSupply()"]()).to.equal(0);
    });
  });
  describe("maxSupply settings", function () {
    it("Should allow owner to change max supply", async function () {
      const { contract, maxSupply } = await loadFixture(deployTokenFixture);
      expect(await contract["maxSupply()"]()).to.equal(maxSupply);

      const newMaxSupply = maxSupply * 2n;
      await contract["setMaxSupply(uint256)"](newMaxSupply);

      expect(await contract["maxSupply()"]()).to.not.equal(maxSupply);
      expect(await contract["maxSupply()"]()).to.equal(newMaxSupply);
    });
    it("Should not allow non-owner to change max supply", async function () {
      const { addr1, contract, maxSupply } = await loadFixture(deployTokenFixture);
      expect(await contract["maxSupply()"]()).to.equal(maxSupply);

      const newMaxSupply = maxSupply * 2n;
      await expect(contract.connect(addr1)["setMaxSupply(uint256)"](newMaxSupply)).to.be.reverted;

      expect(await contract["maxSupply()"]()).to.equal(maxSupply);
      expect(await contract["maxSupply()"]()).to.not.equal(newMaxSupply);
    });
    it("Should not allow owner to mint more than the max supply", async function () {
      const { addr1, contract, maxSupply } = await loadFixture(deployTokenFixture);

      // Mint a token
      for (let i = 0; i < maxSupply; i++) {
        await contract["mint(address)"](addr1.address);
      }

      // Total supply/balance of for address 1 should be maxSupply
      expect(await contract.balanceOf(addr1.address)).to.equal(maxSupply);
      expect(await contract["totalSupply()"]()).to.equal(maxSupply);

      // Fail to mint a token
      await expect(contract["mint(address)"](addr1.address)).to.be.reverted;
    });
  });
  describe("SupportInterface", function () {
    it("Should return false for interface it doesn't support", async function () {
      const { contract } = await loadFixture(deployTokenFixture);
      // TODO: More research in how supportsInterface works under the hood.
      // Not positive this test does anything useful, but might want to implement
      // it better in the future.
      expect(await contract.supportsInterface("0x00000000")).to.be.false;
    });
  });
  describe("Secondary royalties", function () {
    // NOTE: Secondary royalties implemented using EIP-2981 (NFT Royalty Standards)
    // NOTE: In this test, addr2 should have 5% secondary royalties
    beforeEach(async function () {
      const { addr1, contract } = await loadFixture(deployTokenFixture);
      // Mint the 0 ID token to check royalties against
      await contract["mint(address)"](addr1.address);
    });

    it("Should have default secondary royalties set", async function () {
      const { addr2, contract } = await loadFixture(deployTokenFixture);
      // Check default secondary royalties
      const [royaltyAddress, amountDue] = await contract.royaltyInfo(0, 100);

      expect(royaltyAddress).to.equal(addr2.address);
      expect(amountDue).to.equal(5n);
    });
  });
});
