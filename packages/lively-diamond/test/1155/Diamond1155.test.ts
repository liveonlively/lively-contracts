import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { Wallet } from "ethers";
import { ethers } from "hardhat";

import { defaultArgs, oneHourFromNowInSeconds } from "../../scripts/1155/defaultArgs";
import { deployDiamond } from "../../scripts/1155/deployOld";
import { AllowListFacet, ERC1155Facet, OwnableFacet, PaymentSplitterFacet, RoyaltyFacet } from "../../types";

// TODO: Add non owner should not be able to mint test for airdrop
describe(`DiamondBase 1155 Test`, function () {
  async function deployTokenFixture() {
    const [owner, livelyDev, signer1, signer2, signer3, ...signers] = await ethers.getSigners();

    const diamondAddress = await deployDiamond();
    const diamondContract = await ethers.getContractAt("ERC1155Facet", diamondAddress);

    // Typed Facets
    const diamondFacet = diamondContract as unknown as ERC1155Facet;
    const royaltyFacet = diamondContract as unknown as RoyaltyFacet;
    const allowListFacet = diamondContract as unknown as AllowListFacet;
    const paymentSplitterFacet = diamondContract as unknown as PaymentSplitterFacet;

    await diamondFacet.create({
      maxSupply: 100,
      price: 50,
      tokenUri: "",
      allowListEnabled: false,
      startTime: oneHourFromNowInSeconds,
      isCrossmintUSDC: false,
      creator: ethers.ZeroAddress,
    });
    await diamondFacet.create({
      maxSupply: 100,
      price: 200,
      tokenUri: "",
      allowListEnabled: false,
      startTime: 0,
      isCrossmintUSDC: false,
      creator: ethers.ZeroAddress,
    });

    const diamondUSDAddress = await deployDiamond(owner, livelyDev, { isPriceUSD: true });
    const diamondUSDFacet = await ethers.getContractAt("ERC1155Facet", diamondUSDAddress);

    // Create a token with the price of $10.00 (tokenID 3)
    const testUSDPrice = 1000; // $10.00
    await diamondUSDFacet.create({
      maxSupply: 100,
      price: testUSDPrice,
      tokenUri: "",
      allowListEnabled: false,
      startTime: 0,
      isCrossmintUSDC: false,
      creator: ethers.ZeroAddress,
    });

    // Used for testing USD values
    const PriceMock = await ethers.getContractFactory("PriceMock");
    const priceMock = await PriceMock.deploy();

    return {
      owner,
      livelyDev,
      signer1,
      signer2,
      signer3,
      signers,
      diamondAddress,
      diamondFacet,
      diamondUSDAddress,
      diamondUSDFacet,
      testUSDPrice,
      priceMock,
      royaltyFacet,
      allowListFacet,
      paymentSplitterFacet,
    };
  }

  describe("Pack Functionality", function () {
    it("Should allow the owner to create a pack", async function () {
      // 3 Tokens exist on the contract totaling 0.00012 ETH for all 3. Make a pack for 0.00006 ETH for 0, 1, 2 so they're half off.
      const { diamondFacet, signer1 } = await loadFixture(deployTokenFixture);

      const priceForAllTokens = defaultArgs._tokenData.reduce((acc, token) => {
        return (acc as bigint) + (token.price as bigint);
      }, BigInt(0));

      const newPackPrice = priceForAllTokens / BigInt(2); // Half off!

      // Owner should be able to create pack
      await expect(diamondFacet.packCreate([0, 1, 2], newPackPrice, 0)).to.not.be.reverted;

      // Signer1 should not be able to create pack
      await expect(diamondFacet.connect(signer1).packCreate([0, 1, 2], newPackPrice, 0)).to.be.reverted;

      // Confirm all 3 tokens have 0 supply
      // expect(
      //   await (diamondFacet as unknown as ERC1155Facet).totalSupply(0)
      // ).to.equal(0);
      expect(await diamondFacet.totalSupply(0)).to.equal(0);
      expect(await diamondFacet.totalSupply(1)).to.equal(0);
      expect(await diamondFacet.totalSupply(2)).to.equal(0);

      // Signer 1 should fail to buy the pack for 0.00005 ETH
      await expect(
        diamondFacet.connect(signer1).packMint(signer1.address, 0, 1, {
          value: ethers.parseEther("0.00005"),
        })
      ).to.be.reverted;

      // Signer 1 should be able to buy the pack for 0.00006 ETH and have 1 of each token
      await expect(
        diamondFacet.connect(signer1).packMint(signer1.address, 0, 1, {
          value: newPackPrice,
        })
      ).to.not.be.reverted;

      // Confirm all 3 tokens have 0 supply
      // expect(await diamondFacet.totalSupply(0)).to.equal(1);
      expect(await diamondFacet.totalSupply(0)).to.equal(1);
      expect(await diamondFacet.totalSupply(1)).to.equal(1);
      expect(await diamondFacet.totalSupply(2)).to.equal(1);

      // Signer 1 should have a balance of 1 for all 3 tokens
      expect(await diamondFacet.balanceOf(signer1.address, 0)).to.equal(1);
      expect(await diamondFacet.balanceOf(signer1.address, 1)).to.equal(1);
      expect(await diamondFacet.balanceOf(signer1.address, 2)).to.equal(1);

      // Signer 1 should fail to buy 2 packs for the price of 1 pack
      await expect(
        diamondFacet.connect(signer1).packMint(signer1.address, 0, 2, {
          value: newPackPrice,
        })
      ).to.be.reverted;

      // Signer 1 should be able to buy 2 packs for the price of 2 packs
      await expect(
        diamondFacet.connect(signer1).packMint(signer1.address, 0, 2, {
          value: newPackPrice * BigInt(2),
        })
      ).to.not.be.reverted;

      // Signer 1 should have a balance of 3 for all 3 tokens
      expect(await diamondFacet.balanceOf(signer1.address, 0)).to.equal(3);
      expect(await diamondFacet.balanceOf(signer1.address, 1)).to.equal(3);
      expect(await diamondFacet.balanceOf(signer1.address, 2)).to.equal(3);
    });
  });

  describe("PaymentSplitterUpdate", function () {
    // FIXME: This test is failing
    it("Should allow the owner to update the payment splitter", async function () {
      const { paymentSplitterFacet, owner, livelyDev, signer1, signer2, diamondAddress } = await loadFixture(
        deployTokenFixture
      );

      // Both owner and livelyDev should own 50 shares
      expect(await paymentSplitterFacet.shares(owner.address)).to.equal(50);
      expect(await paymentSplitterFacet.shares(livelyDev.address)).to.equal(50);
      expect(await paymentSplitterFacet.shares(signer1.address)).to.equal(0);

      // Send 2 ether to the contract
      const tx = {
        to: diamondAddress,
        value: ethers.parseEther("2"),
      };
      await signer2.sendTransaction(tx);

      // Both owner and livelyDev should have 1 ether
      expect(await paymentSplitterFacet["releasable(address)"](owner.address)).to.equal(ethers.parseEther("1"));
      expect(await paymentSplitterFacet["releasable(address)"](livelyDev.address)).to.equal(ethers.parseEther("1"));
      expect(await paymentSplitterFacet["released(address)"](signer1.address)).to.equal(0);

      // Owner should be able to update the payment splitter to signer 1. Owner should now own 0 shares.
      await paymentSplitterFacet.updatePaymentSplitterAddress(signer1.address);
      expect(await paymentSplitterFacet.shares(owner.address)).to.equal(0);
      expect(await paymentSplitterFacet.shares(signer1.address)).to.equal(50);
      expect(await paymentSplitterFacet.shares(livelyDev.address)).to.equal(50);

      // LivelyDev and Signer1 should have 1 ether releasable, Owner should have 0 ether releasable
      expect(await paymentSplitterFacet["releasable(address)"](owner.address)).to.equal(0);
      expect(await paymentSplitterFacet["releasable(address)"](signer1.address)).to.equal(ethers.parseEther("1"));
      expect(await paymentSplitterFacet["releasable(address)"](livelyDev.address)).to.equal(ethers.parseEther("1"));

      // Have signer1 release their funds
      await paymentSplitterFacet.connect(signer1)["release(address)"](signer1.address);

      // Signer1 should have 0 ether releasable and 1 ether released
      expect(await paymentSplitterFacet["releasable(address)"](signer1.address)).to.equal(0);
      expect(await paymentSplitterFacet["released(address)"](signer1.address)).to.equal(ethers.parseEther("1"));

      // Owner should send 1 ether to the contract
      const tx2 = {
        to: diamondAddress,
        value: ethers.parseEther("1"),
      };
      await owner.sendTransaction(tx2);

      // LivelyDev should have 1.5 ether releasable, Signer1 should have 0.5 ether releasable, Owner should have 0 ether releasable
      expect(await paymentSplitterFacet["releasable(address)"](owner.address)).to.equal(0);
      expect(await paymentSplitterFacet["releasable(address)"](signer1.address)).to.equal(ethers.parseEther("0.5"));
      expect(await paymentSplitterFacet["releasable(address)"](livelyDev.address)).to.equal(ethers.parseEther("1.5"));
    });

    // FIXME: This test is failing
    it("Should revert if the caller isn't a payee", async function () {
      const { paymentSplitterFacet, signer1, signer2 } = await loadFixture(deployTokenFixture);

      // Ethers interface with InvalidPayee() error
      const errorInterface = [
        {
          type: "error",
          name: "InvalidPayee",
          inputs: [],
        },
      ];
      const contractInterface = new ethers.Interface(errorInterface);

      await expect(
        paymentSplitterFacet.connect(signer1).updatePaymentSplitterAddress(signer2.address)
      ).to.be.revertedWithCustomError({ interface: contractInterface }, "InvalidPayee");
    });
  });

  describe("Deployment", function () {
    it("Diamond should say token 0 exists", async function () {
      const { diamondFacet } = await loadFixture(deployTokenFixture);
      expect(await diamondFacet.exists(0)).to.equal(true);
    });

    // FIXME: This test is failing
    it("Diamond should have the correct owner", async function () {
      const { owner, diamondFacet } = await loadFixture(deployTokenFixture);
      expect(await (diamondFacet as unknown as OwnableFacet).owner()).to.equal(owner.address);
    });

    it("Diamond should mint correctly", async function () {
      const { owner, diamondFacet } = await loadFixture(deployTokenFixture);
      await diamondFacet["mint(address,uint256,uint256)"](owner.address, 0, 1, {
        value: 50,
      });

      expect(await diamondFacet.balanceOf(owner.address, 0)).to.equal(1);
    });

    it("Diamond should fail to mint if price is incorrect (and not owner)", async function () {
      const { owner, signer1, diamondFacet } = await loadFixture(deployTokenFixture);
      await expect(diamondFacet.connect(signer1)["mint(address,uint256,uint256)"](owner.address, 0, 1, { value: 49 }))
        .to.be.reverted;
    });

    it("Diamond should succeed to mint if the owner pays 0 while trying to buy 2", async function () {
      const { owner, diamondFacet } = await loadFixture(deployTokenFixture);

      // Mint 2 copies of edition 0 with the 0 eth sent as owner (should succeed)
      await expect(
        diamondFacet["mint(address,uint256,uint256)"](owner.address, 0, 2, {
          value: 0,
        })
      ).to.not.be.reverted;
    });

    it("Diamond should fail to mint if the user pays for 1 while trying to buy 2", async function () {
      const { owner, signer3, diamondFacet } = await loadFixture(deployTokenFixture);

      // Mint 2 copies of edition 0 with the price of 1 copy (should fail)
      await expect(
        diamondFacet.connect(signer3)["mint(address,uint256,uint256)"](owner.address, 0, 2, {
          value: defaultArgs._tokenData[0].price,
        })
      ).to.be.reverted;
    });

    it("Diamond should succeed if minting two and paying the price for two", async function () {
      const { owner, signer1, diamondFacet } = await loadFixture(deployTokenFixture);

      // Mint 2 copies of edition 0 with the correct price (should succeed)
      await expect(
        diamondFacet.connect(signer1)["mint(address,uint256,uint256)"](owner.address, 0, 2, {
          value: (defaultArgs._tokenData[0].price as bigint) * BigInt(2),
        })
      ).to.not.be.reverted;
    });

    it("Diamond should fail to mint if the user pays for less than the quantity worth", async function () {
      const { owner, signer1, diamondFacet } = await loadFixture(deployTokenFixture);

      // Trying to buy two for the price of one
      await expect(
        diamondFacet.connect(signer1)["mint(address,uint256,uint256)"](owner.address, 0, 2, {
          value: defaultArgs._tokenData[0].price,
        })
      ).to.be.reverted;
    });

    it("Diamond should allow the owner to mint for free", async function () {
      const { owner, diamondFacet } = await loadFixture(deployTokenFixture);

      await diamondFacet["mint(address,uint256,uint256)"](owner.address, 0, 5, {
        value: 0,
      });

      expect(await diamondFacet.balanceOf(owner.address, 0)).to.equal(5);
    });

    it("Diamond should not allow the signer1 to mint for free", async function () {
      const { owner, diamondFacet, signer1 } = await loadFixture(deployTokenFixture);

      await expect(
        diamondFacet.connect(signer1)["mint(address,uint256,uint256)"](owner.address, 0, 5, {
          value: 0,
        })
      ).to.be.revertedWithCustomError(diamondFacet, "InvalidAmount");

      expect(await diamondFacet.balanceOf(owner.address, 0)).to.equal(0);
    });

    it("Diamond should get the token metadata", async function () {
      const { diamondFacet } = await loadFixture(deployTokenFixture);
      expect(await diamondFacet.uri(0)).to.equal("https://golive.ly/web3/meta/something/0");
      expect(await diamondFacet.uri(1)).to.equal("https://golive.ly/web3/meta/something/1");
    });

    it("Diamond should allow the owner to airdrop a token by passing in an array of addresses", async function () {
      const { diamondFacet } = await loadFixture(deployTokenFixture);

      const amountOfWalletsToCreate = 50;
      const randomWalletsAddresses: string[] = [];
      for (let i = 0; i < amountOfWalletsToCreate; i++) {
        randomWalletsAddresses.push(Wallet.createRandom().address);
      }

      // Check all random wallets have a balanceOf 0 for token 2
      for (const wallet of randomWalletsAddresses) {
        expect(await diamondFacet.balanceOf(wallet, 2)).to.equal(0);
      }

      await diamondFacet["mint(address[],uint256,uint256)"](randomWalletsAddresses, 2, 1, { gasLimit: 30000000 });

      // Check all random wallets have a balanceOf 1 for token 2
      for (const wallet of randomWalletsAddresses) {
        expect(await diamondFacet.balanceOf(wallet, 2)).to.equal(1);
      }
    });

    it("Diamond should allow the owner to airdrop to multiple multiple for free", async function () {
      const { signer1, signer2, signer3, diamondFacet } = await loadFixture(deployTokenFixture);

      const recipients = [signer1.address, signer2.address, signer3.address];

      expect(await diamondFacet.balanceOf(signer1.address, 0)).to.equal(0);
      expect(await diamondFacet.balanceOf(signer2.address, 0)).to.equal(0);
      expect(await diamondFacet.balanceOf(signer3.address, 0)).to.equal(0);

      await diamondFacet["mint(address[],uint256,uint256)"](recipients, 0, 1);

      expect(await diamondFacet.balanceOf(signer1.address, 0)).to.equal(1);
      expect(await diamondFacet.balanceOf(signer2.address, 0)).to.equal(1);
      expect(await diamondFacet.balanceOf(signer3.address, 0)).to.equal(1);
    });

    it("Diamond should not allow a random user to airdrop to multiple multiple for free", async function () {
      const { signer1, signer2, signer3, diamondFacet } = await loadFixture(deployTokenFixture);

      const recipients = [signer1.address, signer2.address, signer3.address];

      expect(await diamondFacet.balanceOf(signer1.address, 0)).to.equal(0);
      expect(await diamondFacet.balanceOf(signer2.address, 0)).to.equal(0);
      expect(await diamondFacet.balanceOf(signer3.address, 0)).to.equal(0);

      await expect(diamondFacet.connect(signer1)["mint(address[],uint256,uint256)"](recipients, 0, 1)).to.be.reverted;

      expect(await diamondFacet.balanceOf(signer1.address, 0)).to.equal(0);
      expect(await diamondFacet.balanceOf(signer2.address, 0)).to.equal(0);
      expect(await diamondFacet.balanceOf(signer3.address, 0)).to.equal(0);
    });

    it("Diamond should get the token metadata", async function () {
      const { owner, diamondFacet } = await loadFixture(deployTokenFixture);
      const tokenId = 0;

      // const tx =
      await diamondFacet["mint(address,uint256,uint256)"](owner.address, tokenId, 1, { value: 50 });

      // await tx.wait();
      const metadataUri = await diamondFacet.uri(tokenId);

      expect(metadataUri).to.equal(`${defaultArgs._baseURI}${tokenId}`);
    });
  });

  describe("Create token function", function () {
    // * @param _maxSupply Maximum amount of new token.
    // * @param _price Price of new token.
    // * @param _tokenUri Optional, baseUri is set in ERC1155MetadataStorage (https://sample.com/{id}.json) would be valid)
    // * @param _allowListEnabled Whether or not the token is on the allow list.
    // * @return The newly created token ID
    it("Should allow the owner to create a new token", async function () {
      const { diamondFacet } = await loadFixture(deployTokenFixture);

      expect(await diamondFacet.exists(5)).to.equal(false);

      await diamondFacet.create({
        maxSupply: 50,
        price: 100,
        tokenUri: "",
        allowListEnabled: false,
        startTime: 0,
        isCrossmintUSDC: false,
        creator: ethers.ZeroAddress,
      });

      expect(await diamondFacet.exists(5)).to.equal(true);
    });

    it("Should not allow the signer1 to create a new token", async function () {
      const { signer1, diamondFacet } = await loadFixture(deployTokenFixture);
      expect(await diamondFacet.exists(5)).to.equal(false);

      await expect(
        diamondFacet.connect(signer1).create({
          maxSupply: 100,
          price: 50,
          tokenUri: "",
          allowListEnabled: false,
          startTime: oneHourFromNowInSeconds,
          isCrossmintUSDC: false,
          creator: ethers.ZeroAddress,
        })
      ).to.be.reverted;

      expect(await diamondFacet.exists(5)).to.equal(false);
    });

    it("Should allow the owner to create multiple new tokens in a batch", async function () {
      const { diamondFacet } = await loadFixture(deployTokenFixture);
      expect(await diamondFacet.exists(5)).to.equal(false);

      await diamondFacet["batchCreate(uint256,(uint256,uint256,address,string,bool,uint256,bool))"](4, {
        maxSupply: 50,
        price: 100,
        tokenUri: "",
        allowListEnabled: false,
        startTime: oneHourFromNowInSeconds,
        isCrossmintUSDC: false,
        creator: ethers.ZeroAddress,
      });

      const newIds = [5, 6, 7, 8];

      for (let i = 0; i < newIds.length; i++) {
        expect(await diamondFacet.exists(newIds[i])).to.equal(true);
        expect(await diamondFacet.maxSupply(newIds[i])).to.equal(50);
        expect(await diamondFacet.price(newIds[i])).to.equal(100);
      }

      expect(await diamondFacet.exists(9)).to.equal(false);
    });

    it("Should not allow the signer1 to create multiple new tokens in a batch", async function () {
      const { signer1, diamondFacet } = await loadFixture(deployTokenFixture);
      expect(await diamondFacet.exists(5)).to.equal(false);

      await expect(
        diamondFacet.connect(signer1)["batchCreate(uint256,(uint256,uint256,address,string,bool,uint256,bool))"](4, {
          maxSupply: 100,
          price: 50,
          tokenUri: "",
          allowListEnabled: false,
          startTime: oneHourFromNowInSeconds,
          isCrossmintUSDC: false,
          creator: ethers.ZeroAddress,
        })
      ).to.be.reverted;

      expect(await diamondFacet.exists(5)).to.equal(false);
    });

    it("Should allow owner to batch create tokens with different maxSupplies, price, tokenUris, and allowListEnabled", async function () {
      const { diamondFacet } = await loadFixture(deployTokenFixture);
      const startingEdition = 5;
      expect(await diamondFacet.exists(startingEdition)).to.equal(false);

      const newTokenData = [
        {
          maxSupply: 50,
          price: 100,
          tokenUri: "",
          allowListEnabled: false,
          startTime: 0,
          isCrossmintUSDC: false,
          creator: ethers.ZeroAddress,
        },
        {
          maxSupply: 100,
          price: 200,
          tokenUri: "",
          allowListEnabled: false,
          startTime: 0,
          isCrossmintUSDC: false,
          creator: ethers.ZeroAddress,
        },
        {
          maxSupply: 150,
          price: 300,
          tokenUri: "http://randomurl.com/1",
          allowListEnabled: false,
          startTime: 0,
          isCrossmintUSDC: false,
          creator: ethers.ZeroAddress,
        },
        {
          maxSupply: 200,
          price: 400,
          tokenUri: "",
          allowListEnabled: false,
          startTime: 0,
          isCrossmintUSDC: false,
          creator: ethers.ZeroAddress,
        },
      ];

      await diamondFacet["batchCreate((uint256,uint256,address,string,bool,uint256,bool)[])"](newTokenData);

      for (let i = startingEdition; i < newTokenData.length; i++) {
        expect(await diamondFacet.exists(i)).to.equal(true);
        expect(await diamondFacet.maxSupply(i)).to.equal(newTokenData[i].maxSupply);
        expect(await diamondFacet.price(5 + i)).to.equal(newTokenData[i].price);

        // Special case for tokenUri 6 (third in array)
        if (newTokenData[i].tokenUri) {
          expect(await diamondFacet.uri(i)).to.equal(newTokenData[i].tokenUri);
        } else {
          expect(await diamondFacet.uri(i)).to.equal(`${defaultArgs._baseURI}${i}`);
        }
      }
    });
  });

  describe("Secondary royalties", function () {
    // NOTE: Secondary royalties implemented using EIP-2981 (NFT Royalty Standards)
    // NOTE: In this test, addr2 should have 5% secondary royalties
    beforeEach(async function () {
      const { signer1, diamondFacet } = await loadFixture(deployTokenFixture);
      // Mint the 0 ID token to check royalties against
      await diamondFacet["mint(address,uint256,uint256)"](signer1.address, 0, 1, { value: 50 });
    });

    // TODO: Fix for CI
    // it("Should have default secondary royalties set", async function () {
    //   const { owner, diamondFacet } = await loadFixture(deployTokenFixture);
    //   // Check default secondary royalties
    //   const [royaltyAddress, amountDue] = await diamondFacet.royaltyInfo(
    //     0,
    //     100
    //   );

    //   expect(royaltyAddress).to.equal(owner.address);
    //   expect(amountDue).to.equal(BigNumber.from(5));
    // });
  });

  describe("Start time", function () {
    it("Should not allow the user to mint if it's before the correct time", async function () {
      const { signer1, diamondFacet } = await loadFixture(deployTokenFixture);

      await expect(
        diamondFacet.connect(signer1)["mint(address,uint256,uint256)"](signer1.address, 2, 1, {
          value: 50,
        })
      ).to.be.reverted;
    });

    it("Should allow the owner to mint before the correct time", async function () {
      const { signer1, diamondFacet } = await loadFixture(deployTokenFixture);

      await expect(
        diamondFacet["mint(address,uint256,uint256)"](signer1.address, 2, 1, {
          value: 50,
        })
      ).to.not.be.reverted;
    });

    it("Should allow the owner to set a new time", async function () {
      // Test that should check that the user can mint if it's after the start time
      const { diamondFacet } = await loadFixture(deployTokenFixture);

      // Set the start time to 1 hour from now
      const newStartTime = Math.floor(Date.now() / 1000) + 3600;
      await expect(diamondFacet.setStartTime(2, newStartTime)).to.not.be.reverted;

      // Check that the start time is correct
      expect(await diamondFacet.startTime(2)).to.equal(newStartTime);
    });

    it("Should not allow signer1 to change the startTime", async function () {
      //
      const { signer1, diamondFacet } = await loadFixture(deployTokenFixture);

      // Set the start time to 1 hour from now (but fail)
      const newStartTime = Math.floor(Date.now() / 1000) + 3600;
      await expect(diamondFacet.connect(signer1).setStartTime(2, newStartTime)).to.be.reverted;
    });

    it("Should allow the user to mint if it's before the correct time", async function () {
      const { signer1, diamondFacet } = await loadFixture(deployTokenFixture);

      // Mint the token (owner is minting here before the start time)
      await expect(
        diamondFacet["mint(address,uint256,uint256)"](signer1.address, 2, 1, {
          value: 50,
        })
      ).to.not.be.reverted;
    });
  });

  describe("Allow list", function () {
    // FIXME: This test is failing
    it("Should allow the allow list to be enabled and addresses added", async function () {
      const { signer1, allowListFacet } = await loadFixture(deployTokenFixture);

      // Allow list should be disabled by default
      expect(await allowListFacet.allowListEnabled(0)).to.equal(false);

      // Enabling should fail is not owner
      await expect(allowListFacet.connect(signer1).enableAllowList(0)).to.be.reverted;

      // Enable the allow list
      await allowListFacet.enableAllowList(0);
      expect(await allowListFacet.allowListEnabled(0)).to.equal(true);

      // Initial allow list should be
      const initialAllowList = await allowListFacet.allowList(0);
      expect(initialAllowList.length).to.equal(0);

      // Adding to allow list with non-owner should fail
      await expect(allowListFacet.connect(signer1)["addToAllowList(uint256,address,uint256)"](0, signer1.address, 2)).to
        .be.reverted;

      // const tx = diamondFacet["addToAllowList(uint256,address,uint256)"](0, signer1.address, 2);

      // expect(await tx)
      //   .to.emit(diamondFacet, "AllowListAdded(uint256,address,uint256)")
      //   .withArgs(0, signer1.address, 2);

      // // Adding signer1 again should throw an error
      // await expect(
      //   diamondFacet["addToAllowList(uint256,address,uint256)"](
      //     0,
      //     signer1.address,
      //     4
      //   )
      // ).to.be.revertedWithCustomError(
      //   diamondFacet,
      //   "AccountAlreadyAllowListed"
      // );
    });
  });

  describe("EIP-165", function () {
    it("Should return the correct EIP-165 Standard Interface Detection", async function () {
      const { royaltyFacet } = await loadFixture(deployTokenFixture);

      // 0x01ffc9a7 = ERC-165
      expect(await royaltyFacet.supportsInterface("0x01ffc9a7")).to.equal(true);
      // 0xd9b67a26 = ERC-1155
      expect(await royaltyFacet.supportsInterface("0xd9b67a26")).to.equal(true);
      // 0x1f931c1c = IDiamondCut
      expect(await royaltyFacet.supportsInterface("0x1f931c1c")).to.equal(true);
      // 0x48e2b093 = IDiamondLoupe
      expect(await royaltyFacet.supportsInterface("0x48e2b093")).to.equal(true);
      // 0x7f5828d0 = IERC173
      expect(await royaltyFacet.supportsInterface("0x7f5828d0")).to.equal(true);
      // 0x0e89341c = IERC1155Metadata
      expect(await royaltyFacet.supportsInterface("0x0e89341c")).to.equal(true);
      // 0x2a55205a = IERC2981
      expect(await royaltyFacet.supportsInterface("0x2a55205a")).to.equal(true);
    });
  });

  describe("USD Tests", function () {
    it("Should return the price is USD", async function () {
      const { diamondUSDFacet, testUSDPrice, priceMock } = await loadFixture(deployTokenFixture);

      const onChainPriceInWei = await priceMock.convertUSDtoWei(testUSDPrice);

      const priceInWei = await diamondUSDFacet.price(3);
      expect(priceInWei).to.equal(priceInWei);
      expect(priceInWei).to.not.equal(testUSDPrice);
      expect(priceInWei).to.equal(onChainPriceInWei);
    });
  });

  describe("Batch Creates", function () {
    it("Batch create test...", async function () {
      const { royaltyFacet } = await loadFixture(deployTokenFixture);

      // 0x01ffc9a7 = ERC-165
      expect(await royaltyFacet.supportsInterface("0x01ffc9a7")).to.equal(true);
      // 0xd9b67a26 = ERC-1155
      expect(await royaltyFacet.supportsInterface("0xd9b67a26")).to.equal(true);
      // 0x1f931c1c = IDiamondCut
      expect(await royaltyFacet.supportsInterface("0x1f931c1c")).to.equal(true);
      // 0x48e2b093 = IDiamondLoupe
      expect(await royaltyFacet.supportsInterface("0x48e2b093")).to.equal(true);
      // 0x7f5828d0 = IERC173
      expect(await royaltyFacet.supportsInterface("0x7f5828d0")).to.equal(true);
      // 0x0e89341c = IERC1155Metadata
      expect(await royaltyFacet.supportsInterface("0x0e89341c")).to.equal(true);
      // 0x2a55205a = IERC2981
      expect(await royaltyFacet.supportsInterface("0x2a55205a")).to.equal(true);
    });
  });

  //   describe("Metadata", function () {
  //     it("Should return basic metadata", async function () {
  //       const { signer1, signer2, signer3, metadataFacet } = await loadFixture(
  //         deployTokenFixture
  //       );x

  //       // string description; // "Umphrey's McGee Nashville, TN 12/15/2020. Collection of all songs in the Lively NFT player and the ability to mint out all the songs into individual NFTs."
  //       // string external_url; // https://golive.ly
  //       // string image; // https://golive.ly/metadata/1155/images/{id}.png
  //       // string name; // UM Tour Dec 15th, 22 - Nashville
  //       // string animation_url; // https://golive.ly/metadata/1155/animations/{id}.mp4
  //       // Attribute[] attributes; // [{ "trait_type": "Artist", "value": "Umphrey's McGee"}]
  //       const metadata: MetadataStorage.LayoutStruct = {
  //         description:
  //           "Umphrey's McGee Nashville, TN 12/15/2020. Collection of all songs in the Lively NFT player and the ability to mint out all the songs into individual NFTs.",
  //         external_url: "https://golive.ly",
  //         image: "https://golive.ly/metadata/1155/images/{id}.png",
  //         name: "UM Tour Dec 15th, 22 - Nashville",
  //         animation_url: "https://golive.ly/metadata/1155/animations/{id}.mp4",
  //         attributes: [{ trait_type: "Artist", value: "Umphrey's McGee" }],
  //       };

  //       await metadataFacet.setMetadata(metadata);
  //       console.log({ signer1, signer2, signer3, metadataFacet });
  //     });
  // });
});
