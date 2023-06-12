/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
import { expect } from "chai";
import { ethers } from "hardhat";
import { valueToEther } from "../shared";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { deploy, defaultArgs } from "../../scripts/deployDiamondVerify";

describe(`DiamondEditionsClient Test`, function () {
  async function deployTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners(); // ...addrs

    const defaultPrice = valueToEther("0.5");
    const incorrectPrice = valueToEther("0.001");
    const edition1MaxSupply = 10;
    const edition1Price = defaultPrice;
    const edition2MaxSupply = 20;
    const edition2Price = defaultPrice / 2n;

    defaultArgs._price = defaultPrice;
    defaultArgs._baseTokenUri = "https://golive.ly/web3/meta/random-guid/";
    defaultArgs._secondaryPayee = addr2.address;
    defaultArgs._airdrop = false;
    defaultArgs._isPriceUSD = false;
    defaultArgs._automaticUSDConversion = false;
    defaultArgs._maxMintPerAddress = 0; // Turn off max mints per address
    defaultArgs._maxMintPerTx = 0; // Turn off max mints per tx
    defaultArgs._editions = [
      {
        name: "Test Edition 1",
        maxSupply: edition1MaxSupply,
        totalSupply: 0,
        price: edition1Price,
      },
      {
        name: "Test Edition 2",
        maxSupply: edition2MaxSupply,
        totalSupply: 0,
        price: edition2Price,
      },
    ];

    const contractAddress = await deploy(defaultArgs, {
      verify: false,
      client: true,
    });

    const contract = await ethers.getContractAt("DummyDiamond721Implementation", contractAddress, owner);

    const maxSupply = await contract["maxSupply()"]();

    return {
      owner,
      addr1,
      addr2,
      defaultPrice,
      incorrectPrice,
      contract,
      maxSupply,
      edition1MaxSupply,
      edition2MaxSupply,
      edition1Price,
      edition2Price,
      baseTokenUri: defaultArgs._baseTokenUri,
    };
  }

  describe("Price settings", function () {
    it("Should return the new lively contract with default price", async () => {
      const { defaultPrice, contract } = await loadFixture(deployTokenFixture);
      expect(await contract["price()"]()).to.equal(defaultPrice);
    });

    it("Should allow owner role to change contract price", async () => {
      const { defaultPrice, contract } = await loadFixture(deployTokenFixture);
      // Set new price
      const newPrice = valueToEther("0.01");
      await contract["setPrice(uint256)"](newPrice);

      // Check new price
      expect(await contract["price()"]()).to.not.equal(defaultPrice);
      expect(await contract["price()"]()).to.equal(newPrice);
    });

    it("Should not allow non-owner role to change contract price", async () => {
      const { addr1, defaultPrice, contract } = await loadFixture(deployTokenFixture);
      // Set new price
      const newPrice = BigInt(valueToEther("0.01"));
      await expect(contract.connect(addr1)["setPrice(uint256)"](newPrice)).to.be.reverted;

      // Check price is still default
      expect(await contract["price()"]()).to.equal(defaultPrice);
      expect(await contract["price()"]()).to.not.equal(newPrice);
    });
  });

  describe("NFT Minting", function () {
    it("Should mint if I send the correct price", async () => {
      const { addr1, defaultPrice, contract } = await loadFixture(deployTokenFixture);
      // Mint a token
      await contract["mint(address,uint256,uint256)"](addr1.address, 1, 0, {
        value: defaultPrice,
      });

      // Total supply/balance of for address 1 should be 1
      expect(await contract["balanceOf(address)"](addr1.address)).to.equal(1);
      expect(await contract["totalSupply()"]()).to.equal(1);
    });

    it("Should allow non-owners to mint", async () => {
      const { addr1, defaultPrice, contract } = await loadFixture(deployTokenFixture);
      // Non-owner mints

      await contract.connect(addr1)["mint(address,uint256,uint256)"](addr1.address, 1, 0, {
        value: defaultPrice,
      });

      expect(await contract["totalSupply()"]()).to.equal(1n);
    });

    it("Should not mint I send less than the required price", async () => {
      const { addr1, incorrectPrice, contract } = await loadFixture(deployTokenFixture);
      // Fail to mint a token
      await expect(
        contract["mint(address,uint256,uint256)"](addr1.address, 1, 0, {
          value: incorrectPrice,
        }),
      ).to.be.reverted;

      // Total supply/balance of for address 1 should be 0
      expect(await contract["balanceOf(address)"](addr1.address)).to.equal(0);
      expect(await contract["totalSupply()"]()).to.equal(0);
    });
  });

  describe("Contract/Token URI settings", function () {
    const newURI = "https://golive.ly/";

    it("Should allow owner to change edition token URI", async () => {
      const { addr1, defaultPrice, contract, baseTokenUri } = await loadFixture(deployTokenFixture);

      await contract["mint(address,uint256,uint256)"](addr1.address, 1, 0, {
        value: defaultPrice,
      });
      expect(await contract.tokenURI(0)).to.equal(baseTokenUri + "0/0");

      await contract.setTokenURI(newURI);

      // Mint a token, ID 0, and check new URI is returned
      await contract["mint(address,uint256,uint256)"](addr1.address, 1, 0, {
        value: defaultPrice,
      });

      expect(await contract.tokenURI(1)).to.equal(newURI + "1/0");
    });

    it("Should not allow non-owner to change base token URI", async () => {
      const { addr1, defaultPrice, contract, baseTokenUri } = await loadFixture(deployTokenFixture);
      await expect(contract.connect(addr1).setTokenURI(newURI)).to.be.reverted;

      // Mint a token, ID 0, and check default URI is returned
      await contract["mint(address,uint256,uint256)"](addr1.address, 1, 0, {
        value: defaultPrice,
      });

      expect(await contract.tokenURI(0)).to.equal(baseTokenUri + "0/0");
    });

    it("Token URI should change even if it was minted before the URI change", async () => {
      const { addr1, defaultPrice, contract, baseTokenUri } = await loadFixture(deployTokenFixture);
      // Mint a token, ID 0
      await contract["mint(address,uint256,uint256)"](addr1.address, 1, 0, {
        value: defaultPrice,
      });

      expect(await contract.tokenURI(0)).to.equal(baseTokenUri + "0/0");

      // Set and check new URI
      await contract.setTokenURI(newURI);
      expect(await contract.tokenURI(0)).to.equal(newURI + "0/0");
    });
  });

  describe("Contract pausing", function () {
    it("Should allow owner to pause contract", async () => {
      const { contract } = await loadFixture(deployTokenFixture);
      expect(await contract.paused()).to.be.false;
      await contract.pause();
      expect(await contract.paused()).to.be.true;
    });

    it("Should not allow non-owner to pause contract", async () => {
      const { addr1, contract } = await loadFixture(deployTokenFixture);
      expect(await contract.paused()).to.be.false;
      await expect(contract.connect(addr1).pause()).to.be.reverted;
      expect(await contract.paused()).to.be.false;
    });

    it("Should not be able to mint if contract is paused", async () => {
      const { addr1, defaultPrice, contract } = await loadFixture(deployTokenFixture);
      // Pause contract
      await contract.pause();
      expect(await contract.paused()).to.be.true;

      // Fail to mint a token
      await expect(
        contract["mint(address,uint256,uint256)"](addr1.address, 1, 0, {
          value: defaultPrice,
        }),
      ).to.be.reverted;

      // Total supply/balance of for address 1 should be 0
      expect(await contract["balanceOf(address)"](addr1.address)).to.equal(0);
      expect(await contract["totalSupply()"]()).to.equal(0);
    });

    // it("Should allow owner to reserve token if contract is paused", async () => {
    //   // Pause contract
    //   await contract.pause();
    //   expect(await contract.paused()).to.be.true;

    //   // Mint a token
    //   await contract.reserveToken(addr1.address);

    //   // Total supply/balance of for address 1 should be 1
    //   expect(await contract["balanceOf(address)"](addr1.address)).to.equal(1);
    //   expect(await contract["totalSupply()"]()).to.equal(1);
    // });

    it("Should be able to mint if a contract is unpaused", async () => {
      const { addr1, defaultPrice, contract } = await loadFixture(deployTokenFixture);
      // Pause contract
      await contract.pause();
      expect(await contract.paused()).to.be.true;

      // Unpause contract
      await contract.unpause();
      expect(await contract.paused()).to.be.false;

      // Mint a token
      await contract["mint(address,uint256,uint256)"](addr1.address, 1, 0, {
        value: defaultPrice,
      });

      // Total supply/balance of for address 1 should be 1
      expect(await contract["balanceOf(address)"](addr1.address)).to.equal(1);
      expect(await contract["totalSupply()"]()).to.equal(1);
    });
  });

  describe("MaxSupply settings", () => {
    it("Should allow owner to change max supply", async () => {
      const { contract, maxSupply } = await loadFixture(deployTokenFixture);
      expect(await contract["maxSupply()"]()).to.equal(maxSupply);

      const newMaxSupply = maxSupply * 2n;
      await contract["setMaxSupply(uint256)"](newMaxSupply);

      expect(await contract["maxSupply()"]()).to.not.equal(maxSupply);
      expect(await contract["maxSupply()"]()).to.equal(newMaxSupply);
    });

    it("Should not allow non-owner to change max supply", async () => {
      const { addr1, contract, maxSupply } = await loadFixture(deployTokenFixture);
      expect(await contract["maxSupply()"]()).to.equal(maxSupply);

      const newMaxSupply = maxSupply * 2n;
      await expect(contract.connect(addr1)["setMaxSupply(uint256)"](newMaxSupply)).to.be.reverted;

      expect(await contract["maxSupply()"]()).to.equal(maxSupply);
      expect(await contract["maxSupply()"]()).to.not.equal(newMaxSupply);
    });

    it("Should not allow owner to mint more than the max supply", async () => {
      const { addr1, defaultPrice, contract, maxSupply, edition1MaxSupply } = await loadFixture(deployTokenFixture);
      // Mint a token
      for (let i = 0; i < edition1MaxSupply; i++) {
        await contract["mint(address,uint256,uint256)"](addr1.address, 1, 0, {
          value: defaultPrice,
        });
      }

      // Total supply/balance of for address 1 should be maxSupply
      expect(await contract["balanceOf(address)"](addr1.address)).to.equal(edition1MaxSupply);
      expect(await contract["totalSupply()"]()).to.equal(edition1MaxSupply);

      // Fail to mint a token
      await expect(
        contract["mint(address,uint256,uint256)"](addr1.address, 1, 0, {
          value: defaultPrice,
        }),
      ).to.be.reverted;
    });

    // it("Should not allow owner to exceed max supply even if using reserveToken", async () => {
    //   // Mint a token
    //   for (let i = 0; i < maxSupply; i++) {
    //     await contract["mint(address,uint256,uint256)"](addr1.address, 1, 0, { value: defaultPrice });
    //   }

    //   // Total supply/balance of for address 1 should be maxSupply
    //   expect(await contract["balanceOf(address)"](addr1.address)).to.equal(maxSupply);
    //   expect(await contract["totalSupply()"]()).to.equal(maxSupply);

    //   // Fail to reserve/mint a token
    //   await expect(contract.reserveToken(addr1.address)).to.be.revertedWith(
    //     "Purchase would exceed max supply of tokens"
    //   );
    // });
  });

  describe("SupportInterface", () => {
    it("Should return false for interface it doesn't support", async () => {
      const { contract } = await loadFixture(deployTokenFixture);
      // TODO: More research in how supportsInterface works under the hood.
      // Not positive this test does anything useful, but might want to implement
      // it better in the future.
      expect(await contract.supportsInterface("0x00000000")).to.be.false;
    });
  });

  describe("Secondary royalties", () => {
    // NOTE: Secondary royalties implemented using EIP-2981 (NFT Royalty Standards)
    // NOTE: In this test, addr2 should have 5% secondary royalties
    beforeEach(async function () {
      const { addr1, defaultPrice, contract } = await loadFixture(deployTokenFixture);
      // Mint the 0 ID token to check royalties against
      await contract["mint(address,uint256,uint256)"](addr1.address, 1, 0, {
        value: defaultPrice,
      });
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
