import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";
import { Context } from "mocha";

import type { Greeter } from "../../types/Greeter";
import type { Greeter__factory } from "../../types/factories/Greeter__factory";
import { Signers } from "../types";

export async function deployGreeterFixture(): Promise<{ greeter: Greeter }> {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  const admin: SignerWithAddress = signers[0];

  const greeting: string = "Hello, world!";
  const greeterFactory: Greeter__factory = <Greeter__factory>await ethers.getContractFactory("Greeter");
  const greeter: Greeter = <Greeter>await greeterFactory.connect(admin).deploy(greeting);
  await greeter.deployed();

  return { greeter };
}

export async function createFixtureLoader(_this: Context) {
  _this.signers = {} as Signers;

  const signers: SignerWithAddress[] = await ethers.getSigners();
  _this.signers.admin = signers[0];
  _this.signers.user = signers[1];

  _this.loadFixture = loadFixture;
}
