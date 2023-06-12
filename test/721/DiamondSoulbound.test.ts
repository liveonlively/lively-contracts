import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { defaultArgs, deploy } from "../../scripts/deployDiamondVerify";
import { valueToEther } from "../shared";

// This is the number the oracle returns for USD at the block that is pinned
const PINNED_USD_PRICE = 134045026073;
const ACCEPTABLE_WEI_DIFFERENCE = 200000;

describe(`DiamondSoulbound Test`, function () {
  async function deployTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners(); // ...addrs

    // const defaultPrice = valueToEther("0.5");
    const defaultPrice = valueToEther("0.1"); // $670.22, half an ether at the time the block is pinned

    defaultArgs._price = defaultPrice;
    defaultArgs._baseTokenUri = "https://golive.ly/tokenuri/";
    defaultArgs._secondaryPayee = addr2.address;
    defaultArgs._airdrop = false;
    defaultArgs._isPriceUSD = false;
    defaultArgs._automaticUSDConversion = false;
    defaultArgs._editions = [];
    defaultArgs._isSoulbound = true;

    const contractAddress = await deploy(defaultArgs, { verify: false });

    const contract = await ethers.getContractAt("DummyDiamond721Implementation", contractAddress, owner);

    const maxSupply = await contract["maxSupply()"]();

    return {
      owner,
      addr1,
      addr2,
      defaultPrice,
      contract,
      maxSupply,
    };
  }

  describe("Soulbound checks", function () {
    it("Should mint", async () => {
      const { contract, addr1 } = await loadFixture(deployTokenFixture);

      await contract["price()"]();
      await contract["mint(address)"](addr1.address, {
        value: valueToEther("0.1"),
      });

      // Total supply/balance of for address 1 should be 1
      expect(await contract["balanceOf(address)"](addr1.address)).to.equal(1);
      expect(await contract["totalSupply()"]()).to.equal(1);
    });

    it("Should not allow to transfer", async () => {
      const { owner, contract, addr1 } = await loadFixture(deployTokenFixture);

      await contract["price()"]();
      await contract["mint(address)"](addr1.address, {
        value: valueToEther("0.1"),
      });

      // Total supply/balance of for address 1 should be 1
      expect(await contract["balanceOf(address)"](addr1.address)).to.equal(1);
      expect(await contract["totalSupply()"]()).to.equal(1);

      // Try to transfer
      await expect(contract.connect(addr1).transferFrom(addr1.address, owner.address, 0)).to.be.reverted;
    });

    it("Should allow owner to change soulbound state and then transfer succeeds", async () => {
      const { owner, contract, addr1 } = await loadFixture(deployTokenFixture);

      await contract["price()"]();
      await contract["mint(address)"](addr1.address, {
        value: valueToEther("0.1"),
      });

      // Total supply/balance of for address 1 should be 1
      expect(await contract["balanceOf(address)"](addr1.address)).to.equal(1);
      expect(await contract["totalSupply()"]()).to.equal(1);

      // Try to transfer
      await expect(contract.connect(addr1).transferFrom(addr1.address, owner.address, 0)).to.be.reverted;

      await contract.setSoulbound(false);

      // This should transfer
      await contract.connect(addr1).transferFrom(addr1.address, owner.address, 0);

      expect(await contract["balanceOf(address)"](addr1.address)).to.equal(0);
      expect(await contract["balanceOf(address)"](owner.address)).to.equal(1);
    });
  });
});
