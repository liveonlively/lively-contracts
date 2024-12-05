import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { defaultArgs, deploy } from "../../scripts/deployDiamondVerify";
import { deployAndWait } from "../../scripts/utils/deployHelpers";
import { USDCMock } from "../../types";

const USDC_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

describe(`DiamondUSDC Test`, function () {
  async function deployTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners(); // ...addrs

    // const defaultPrice = valueToEther("0.5");
    const defaultPrice = 5000; // $50, half an ether at the time the block is pinned

    defaultArgs._price = defaultPrice;
    defaultArgs._baseTokenUri = "https://golive.ly/tokenuri/";
    defaultArgs._secondaryPayee = addr2.address;
    defaultArgs._airdrop = false;
    defaultArgs._isPriceUSD = true;
    defaultArgs._automaticUSDConversion = true;

    const contractAddress = await deploy(defaultArgs, { verify: false });

    // const contract = (await ethers.getContractAt("LivelyDiamondABI", contractAddress)) as unknown as LivelyDiamondABI;
    const contract = await ethers.getContractAt("LivelyDiamond", contractAddress);

    const maxSupply = await contract["maxSupply()"]();

    const priceMock = await deployAndWait("PriceMock");

    const pinnedUSDPrice = await priceMock.getLatestPrice();
    const priceInWei = await priceMock.convertUSDtoWei(defaultPrice);

    return {
      owner,
      addr1,
      addr2,
      defaultPrice,
      contract,
      maxSupply,
      priceInWei,
      pinnedUSDPrice,
    };
  }

  describe("Deployment", function () {
    it("Should get the current price", async () => {
      const { contract, priceInWei } = await loadFixture(deployTokenFixture);

      expect(await contract["price()"]()).to.equal(priceInWei);
    });

    it("Should mint and autoconvert to USDC", async () => {
      const { addr1, contract, defaultPrice, pinnedUSDPrice } = await loadFixture(deployTokenFixture);
      const convertedPrice = convertUSDtoWEI(defaultPrice, pinnedUSDPrice);

      expect(await contract["balanceOf(address)"](addr1.address)).to.equal(0);
      await expect(
        contract["mint(address)"](addr1.address, {
          value: convertedPrice,
        })
      ).to.not.be.reverted;
      expect(await contract["balanceOf(address)"](addr1.address)).to.equal(1);

      const USDCContract = (await ethers.getContractAt("USDCMock", USDC_ADDRESS)) as USDCMock;

      const usdcBalance = await USDCContract.balanceOf(await contract.getAddress()); // Balance of USDC owned by the contract with correct decimal places
      const difference = percentFromExpected(defaultPrice, usdcBalance);

      expect(difference).to.be.lessThan(0.01); // Less than 1% difference
    });

    it("Should mint and autoconvert to USDC, change price and convert new price", async () => {
      const { addr1, contract, defaultPrice, pinnedUSDPrice } = await loadFixture(deployTokenFixture);
      let cumulativeBalance = 0;
      const convertedPrice = convertUSDtoWEI(defaultPrice, pinnedUSDPrice);

      await contract["mint(address)"](addr1.address, {
        value: convertedPrice,
      });

      expect(await contract["balanceOf(address)"](addr1.address)).to.equal(1);
      cumulativeBalance += defaultPrice;

      const newPrice = 9900; // $99
      await contract["setPrice(uint256)"](newPrice); // $99
      expect(await contract["price()"]()).to.equal(convertUSDtoWEI(newPrice, pinnedUSDPrice));

      await contract["mint(address)"](addr1.address, {
        value: convertUSDtoWEI(newPrice, pinnedUSDPrice),
      });
      expect(await contract["balanceOf(address)"](addr1.address)).to.equal(2);
      cumulativeBalance += newPrice;

      const USDCContract = await ethers.getContractAt("USDCMock", USDC_ADDRESS);
      const usdcBalance = await USDCContract.balanceOf(await contract.getAddress()); // Balance of USDC owned by the contract with correct decimal places
      const difference = percentFromExpected(cumulativeBalance, usdcBalance);

      expect(difference).to.be.lessThan(0.01); // Less than 1% difference
    });
  });
});

/** Compares the hypothetical 100% return from  */
function percentFromExpected(expected: number, balance: bigint): number {
  const paddedExpected = BigInt(expected) * BigInt(10000); // Padding defaultPrice to match the 6 decimal places of USDC
  const balanceNum = balance;
  const percent = (balanceNum - paddedExpected) / paddedExpected;
  return Math.abs(parseInt(percent.toString()));
}

function convertUSDtoWEI(_price: number, pinnedUSDPrice: bigint): bigint {
  const bgPrice = BigInt(_price);
  const oneEth: bigint = BigInt("1000000000000000000");
  const divisor: bigint = BigInt("1000000");

  const USDperWEI = oneEth / (pinnedUSDPrice / divisor);
  // const convertedPrice = USDperWEI.mul(_price); // Causes error
  return USDperWEI * bgPrice;
}
