/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { valueToEther } from "../shared/index";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { deploy, defaultArgs } from "../../scripts/deployDiamondVerify";

describe(`DiamondEditions Test`, function () {
  async function deployTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners(); // ...addrs
    // LivelyDiamond
    // DiamondArgsStruct
    // LivelyDiamond__factory

    const defaultPrice = valueToEther("0.5");
    const incorrectPrice = valueToEther("0.001");
    const edition1MaxSupply = 10;
    const edition1Price = defaultPrice;
    const edition2MaxSupply = 20;
    const edition2Price = defaultPrice.div(2);

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
    });

    const contract = await ethers.getContractAt("DummyDiamond721Implementation", contractAddress, owner);

    const maxSupply = (await contract["maxSupply()"]()).toNumber();

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
      const newPrice = valueToEther("0.01");
      await expect(contract.connect(addr1)["setPrice(uint256)"](newPrice)).to.be.reverted;

      // Check price is still default
      expect(await contract["price()"]()).to.equal(defaultPrice);
      expect(await contract["price()"]()).to.not.equal(newPrice);
    });
  });

  describe("NFT Minting", function () {
    it("Should mint if I send the correct price (edition 0)", async () => {
      const { addr1, edition1Price, contract } = await loadFixture(deployTokenFixture);
      // Mint a token
      await contract["mint(address,uint256,uint256)"](addr1.address, 1, 0, {
        value: edition1Price,
      });

      // Total supply/balance of for address 1 should be 1
      expect(await contract["balanceOf(address)"](addr1.address)).to.equal(1);
      expect(await contract["totalSupply()"]()).to.equal(1);
    });

    it("Should mint if I send the correct price (edition 1)", async () => {
      const { addr1, edition2Price, contract } = await loadFixture(deployTokenFixture);
      // Mint a token
      await contract["mint(address,uint256,uint256)"](addr1.address, 1, 1, {
        value: edition2Price,
      });

      // Total supply/balance of for address 1 should be 1
      expect(await contract["balanceOf(address)"](addr1.address)).to.equal(1);
      expect(await contract["totalSupply()"]()).to.equal(1);
    });

    it("Should allow non-owners to mint", async () => {
      const { addr1, owner, edition1Price, edition2Price, contract, baseTokenUri } = await loadFixture(
        deployTokenFixture,
      );
      // Non-owner mints
      contract.connect(addr1);

      await contract["mint(address,uint256,uint256)"](addr1.address, 2, 1, {
        value: edition2Price.mul(2),
      });
      expect(await contract.tokenURI(0)).to.equal(baseTokenUri + "0/1");
      expect(await contract.tokenURI(1)).to.equal(baseTokenUri + "1/1");

      await contract["mint(address,uint256,uint256)"](addr1.address, 2, 0, {
        value: edition1Price.mul(2),
      });
      expect(await contract.tokenURI(2)).to.equal(baseTokenUri + "2/0");
      expect(await contract.tokenURI(3)).to.equal(baseTokenUri + "3/0");

      await contract["mint(address,uint256,uint256)"](owner.address, 5, 1, {
        value: edition2Price.mul(5),
      });
      expect(await contract.tokenURI(4)).to.equal(baseTokenUri + "4/1");
      expect(await contract.tokenURI(5)).to.equal(baseTokenUri + "5/1");
      expect(await contract.tokenURI(6)).to.equal(baseTokenUri + "6/1");
      expect(await contract.tokenURI(7)).to.equal(baseTokenUri + "7/1");
      expect(await contract.tokenURI(8)).to.equal(baseTokenUri + "8/1");

      expect(await contract["totalSupply()"]()).to.equal(9);
    });

    it("Should allow non-owners to mint and retain collection after transferring", async () => {
      const { addr1, owner, edition1Price, edition2Price, contract, baseTokenUri } = await loadFixture(
        deployTokenFixture,
      );

      await contract.connect(addr1)["mint(address,uint256,uint256)"](addr1.address, 2, 1, {
        value: edition2Price.mul(2),
      });
      expect(await contract.tokenURI(0)).to.equal(baseTokenUri + "0/1");
      expect(await contract.tokenURI(1)).to.equal(baseTokenUri + "1/1");

      await contract.connect(addr1)["mint(address,uint256,uint256)"](addr1.address, 2, 0, {
        value: edition1Price.mul(2),
      });
      expect(await contract.tokenURI(2)).to.equal(baseTokenUri + "2/0");
      expect(await contract.tokenURI(3)).to.equal(baseTokenUri + "3/0");

      await contract.connect(owner)["mint(address,uint256,uint256)"](owner.address, 5, 1, {
        value: edition2Price.mul(5),
      });
      expect(await contract.tokenURI(4)).to.equal(baseTokenUri + "4/1");
      expect(await contract.tokenURI(5)).to.equal(baseTokenUri + "5/1");
      expect(await contract.tokenURI(6)).to.equal(baseTokenUri + "6/1");
      expect(await contract.tokenURI(7)).to.equal(baseTokenUri + "7/1");
      expect(await contract.tokenURI(8)).to.equal(baseTokenUri + "8/1");

      expect(await contract["totalSupply()"]()).to.equal(9);

      // Transfer from addr1 to owner a couple tokens
      await contract.connect(addr1)["safeTransferFrom(address,address,uint256)"](addr1.address, owner.address, 0);
      await contract.connect(addr1)["safeTransferFrom(address,address,uint256)"](addr1.address, owner.address, 3);

      expect(await contract.tokenURI(0)).to.equal(baseTokenUri + "0/1");
      expect(await contract.tokenURI(3)).to.equal(baseTokenUri + "3/0");

      expect(await contract.ownerOf(0)).to.equal(owner.address);
      expect(await contract.ownerOf(3)).to.equal(owner.address);
    });

    it("Should not mint if I send less than the required price (edition 0)", async () => {
      const { addr1, edition1Price, contract } = await loadFixture(deployTokenFixture);
      // Fail to mint a token
      await expect(
        contract["mint(address,uint256,uint256)"](addr1.address, 1, 0, {
          value: edition1Price.div(2),
        }),
      ).to.be.reverted;

      // Total supply/balance of for address 1 should be 0
      expect(await contract["balanceOf(address)"](addr1.address)).to.equal(0);
      expect(await contract["totalSupply()"]()).to.equal(0);
    });

    it("Should not mint if I send less than the required price (edition 1)", async () => {
      const { addr1, edition2Price, contract } = await loadFixture(deployTokenFixture);
      // Fail to mint a token
      await expect(
        contract["mint(address,uint256,uint256)"](addr1.address, 1, 0, {
          value: edition2Price.div(2),
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
      const { addr1, edition1Price, contract, baseTokenUri } = await loadFixture(deployTokenFixture);
      // Mint a token, ID 0
      await contract["mint(address,uint256,uint256)"](addr1.address, 1, 0, {
        value: edition1Price,
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

      const newMaxSupply = maxSupply * 2;
      await contract["setMaxSupply(uint256)"](newMaxSupply);

      expect(await contract["maxSupply()"]()).to.not.equal(maxSupply);
      expect(await contract["maxSupply()"]()).to.equal(newMaxSupply);
    });

    it("Should not allow non-owner to change max supply", async () => {
      const { addr1, contract, maxSupply } = await loadFixture(deployTokenFixture);
      expect(await contract["maxSupply()"]()).to.equal(maxSupply);

      const newMaxSupply = maxSupply * 2;
      await expect(contract.connect(addr1)["setMaxSupply(uint256)"](newMaxSupply)).to.be.reverted;

      expect(await contract["maxSupply()"]()).to.equal(maxSupply);
      expect(await contract["maxSupply()"]()).to.not.equal(newMaxSupply);
    });

    it("Should not allow owner to mint more than the max supply", async () => {
      const { addr1, defaultPrice, contract, edition1MaxSupply } = await loadFixture(deployTokenFixture);
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
      expect(amountDue).to.equal(BigNumber.from(5));
    });
  });
});
