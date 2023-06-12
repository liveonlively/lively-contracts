/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
import { expect } from "chai";
import { ethers } from "hardhat";
import { deploy, defaultArgs } from "../../scripts/deployDiamondVerify";
import { valueToEther } from "../shared";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

// TODO: Add non owner should not be able to mint test for airdrop

describe(`DiamondBase Test`, function () {
  async function deployTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners(); // ...addrs

    const defaultPrice = BigInt(valueToEther("0.005"));
    const incorrectPrice = BigInt(valueToEther("0.001"));

    defaultArgs._price = defaultPrice;
    defaultArgs._baseTokenUri = "https://golive.ly/tokenuri/";
    defaultArgs._secondaryPayee = owner.address;
    defaultArgs._isPriceUSD = false;
    defaultArgs._automaticUSDConversion = false;
    defaultArgs._maxSupply = 50;
    defaultArgs._maxMintPerAddress = 50;
    defaultArgs._maxMintPerTx = 50;

    const contractAddress = await deploy(defaultArgs, { verify: false });

    const contract = await ethers.getContractAt("DummyDiamond721Implementation", contractAddress, owner);

    const maxSupply = await contract["maxSupply()"]();

    // const DEFAULT_ADMIN_ROLE = await contract.DEFAULT_ADMIN_ROLE();
    // const OWNER_ROLE = await contract.OWNER_ROLE();

    return {
      owner,
      addr1,
      addr2,
      defaultPrice,
      incorrectPrice,
      contract,
      maxSupply,
      // DEFAULT_ADMIN_ROLE,
      // OWNER_ROLE,
    };
  }

  describe("Deployment", function () {
    it("Should set default owner rights to deploying wallet", async function () {
      const { owner, contract } = await loadFixture(deployTokenFixture);
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("Should not set default owner rights to other wallets", async function () {
      const { addr1, contract } = await loadFixture(deployTokenFixture);
      expect(await contract.owner()).to.not.equal(addr1.address);
    });
  });
  describe("NFT Minting", function () {
    it("Owner should be able to mint", async function () {
      const { contract, addr1, defaultPrice } = await loadFixture(deployTokenFixture);
      // Mint a token as owner
      await contract["mint(address)"](addr1.address, {
        value: defaultPrice,
      });

      // Total supply/balance of for address 1 should be 1
      expect(await contract["balanceOf(address)"](addr1.address)).to.equal(1);
      expect(await contract["totalSupply()"]()).to.equal(1);
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
      const { owner, defaultPrice, contract, maxSupply } = await loadFixture(deployTokenFixture);
      // Mint a token
      for (let i = 0; i < maxSupply; i++) {
        await contract["mint(address)"](owner.address, { value: defaultPrice });
      }

      // Total supply/balance of for address 1 should be maxSupply
      expect(await contract["balanceOf(address)"](owner.address)).to.equal(maxSupply);
      expect(await contract["totalSupply()"]()).to.equal(maxSupply);

      // Fail to mint a token
      await expect(contract["mint(address)"](owner.address, { value: defaultPrice })).to.be.reverted;
    });
    it("Should allow owner to raise the max supply and keep minting", async function () {
      const { addr1, defaultPrice, contract, maxSupply } = await loadFixture(deployTokenFixture);
      // Mint a token
      for (let i = 0; i < maxSupply; i++) {
        await contract["mint(address)"](addr1.address, { value: defaultPrice });
      }

      // Total supply/balance of for address 1 should be maxSupply
      expect(await contract["balanceOf(address)"](addr1.address)).to.equal(maxSupply);
      expect(await contract["totalSupply()"]()).to.equal(maxSupply);

      // Double max supply
      const newMaxSupply = maxSupply * 2n;
      await contract["setMaxSupply(uint256)"](newMaxSupply);
      await contract.setMaxMintPerAddress(newMaxSupply);

      // Mint a token
      for (let i = 0; i < maxSupply; i++) {
        await contract["mint(address)"](addr1.address, { value: defaultPrice });
      }

      // Total supply/balance of for address 1 should be newmaxSupply
      expect(await contract["balanceOf(address)"](addr1.address)).to.equal(newMaxSupply);
      expect(await contract["totalSupply()"]()).to.equal(newMaxSupply);

      // Fail to mint a token
      await expect(contract["mint(address)"](addr1.address)).to.be.reverted;
    });

    it("Should equate 0 with the maximum number of supply uint256 can allow", async function () {
      const { contract } = await loadFixture(deployTokenFixture);

      await contract["setMaxSupply(uint256)"](0n);

      // BigNumber.from(2).pow(256).sub(1)
      expect(await contract["maxSupply()"]()).to.equal(2n ** 256n - 1n);
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
      const { addr1, defaultPrice, contract } = await loadFixture(deployTokenFixture);
      // Mint the 0 ID token to check royalties against
      await contract["mint(address)"](addr1.address, { value: defaultPrice });
    });

    it("Should have default secondary royalties set", async function () {
      const { owner, contract } = await loadFixture(deployTokenFixture);
      // Check default secondary royalties
      const [royaltyAddress, amountDue] = await contract.royaltyInfo(0, 100);

      expect(royaltyAddress).to.equal(owner.address);
      expect(amountDue).to.equal(5n);
    });
  });

  describe("Ownable interface support", function () {
    // NOTE: OpenSea now requires Ownable to automatically allow secondary royalty sales to be set
    it("Should show ownableOwner as the deploying contract", async function () {
      const { owner, contract } = await loadFixture(deployTokenFixture);
      const currentOwner = await contract.owner();
      expect(currentOwner).to.equal(owner.address);
    });

    it("Should allow transfer of ownership by the current owner", async function () {
      const { owner, addr1, contract } = await loadFixture(deployTokenFixture);
      const previousOwner = owner;
      const newOwner = addr1;

      expect(await contract.owner()).to.equal(previousOwner.address);

      await contract.transferOwnership(newOwner.address);

      expect(await contract.owner()).to.equal(newOwner.address);
      expect(await contract.owner()).not.to.equal(previousOwner.address);
    });
  });

  describe("Required metadata properties", function () {
    it("Should return a contractURI", async function () {
      const { contract } = await loadFixture(deployTokenFixture);
      const contractURI = await contract.contractURI();
      expect(contractURI).to.exist;
      expect(contractURI).to.equal("http://contract.uri");
    });
  });
});
