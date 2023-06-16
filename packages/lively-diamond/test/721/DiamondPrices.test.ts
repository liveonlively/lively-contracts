import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { defaultArgs, deploy } from "../../scripts/deployDiamondVerify";
import { deployAndWait } from "../../scripts/utils/deployHelpers";
import { LivelyDiamondABI, PriceMock } from "../../types";

describe(`DiamondPrice Test`, function () {
  async function deployTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners(); // ...addrs

    const defaultPrice = 65000; // 650.00 USD

    defaultArgs._price = defaultPrice;
    defaultArgs._baseTokenUri = "https://golive.ly/tokenuri/";
    defaultArgs._secondaryPayee = addr2.address;
    defaultArgs._airdrop = false;
    defaultArgs._isPriceUSD = true;
    defaultArgs._automaticUSDConversion = false;
    defaultArgs._editions = [];

    const contractAddress = await deploy(defaultArgs, { verify: false });

    const contract = (await ethers.getContractAt("LivelyDiamondABI", contractAddress)) as unknown as LivelyDiamondABI;

    const maxSupply = await contract["maxSupply()"]();

    const priceMock = (await deployAndWait("PriceMock")) as unknown as PriceMock;

    const pinnedUSDPrice = await priceMock.getLatestPrice();
    const priceInWei = await priceMock.convertUSDtoWei(defaultPrice);

    // const DEFAULT_ADMIN_ROLE = await contract.DEFAULT_ADMIN_ROLE();
    // const OWNER_ROLE = await contract.OWNER_ROLE();

    return {
      owner,
      addr1,
      addr2,
      defaultPrice,
      contract,
      maxSupply,
      pinnedUSDPrice,
      priceInWei,
      priceMock,
      // DEFAULT_ADMIN_ROLE,
      // OWNER_ROLE,
    };
  }

  describe("Deployment", function () {
    it("Should get the current price", async () => {
      const { contract, priceInWei } = await loadFixture(deployTokenFixture);

      await expect(contract["price()"]()).to.not.be.reverted;
      const price = await contract["price()"]();
      console.log({ price });
      expect(await contract["price()"]()).to.equal(priceInWei);
    });

    it("Should mint if I send the correct price", async () => {
      const { addr1, contract, priceInWei } = await loadFixture(deployTokenFixture);
      // Mint a token
      await contract["mint(address)"](addr1.address, {
        value: priceInWei,
      });

      // Total supply/balance of for address 1 should be 1
      expect(await contract["balanceOf(address)"](addr1.address)).to.equal(1);
      expect(await contract["totalSupply()"]()).to.equal(1);
    });

    it("Should not mint if I send the incorrect price", async () => {
      const { addr1, priceInWei, contract } = await loadFixture(deployTokenFixture);
      // Mint a token
      await expect(
        contract["mint(address)"](addr1.address, {
          value: priceInWei / 2n,
        }),
      ).to.be.reverted;
    });

    it("Should be able to change the price", async () => {
      const { contract, priceMock } = await loadFixture(deployTokenFixture);
      // Set the price to 100.00 USD
      const newPrice = 10000;
      await contract["setPrice(uint256)"](newPrice); // One eth at pinned testing block

      const convertedPrice = await priceMock.convertUSDtoWei(newPrice);

      expect(await contract["price()"]()).to.equal(convertedPrice);
    });

    it("Should not be able to change exact price if not owner", async () => {
      const { contract, addr1 } = await loadFixture(deployTokenFixture);
      // Mint a token
      await expect(contract.connect(addr1)["setPrice(uint256)"](2500)).to.be.reverted; // $25.00
    });
  });
});
