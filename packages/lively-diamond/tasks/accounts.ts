import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { task } from "hardhat/config";

task("accounts", "Prints the list of accounts", async (_taskArgs, hre) => {
  const accounts: HardhatEthersSigner[] = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.getAddress());
  }
});