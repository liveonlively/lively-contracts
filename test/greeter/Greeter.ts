import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import { ethers } from "hardhat";

import type { Signers } from "../types";
import { shouldBehaveLikeGreeter } from "./Greeter.behavior";
import { createFixtureLoader, deployGreeterFixture } from "./Greeter.fixture";

describe("Unit tests", function () {
  before(async function () {
    await createFixtureLoader(this);
    // this.signers = {} as Signers;
    // const signers: SignerWithAddress[] = await ethers.getSigners();
    // this.signers.admin = signers[0];
    // this.signers.user = signers[1];
    // this.loadFixture = loadFixture;
  });

  describe("Greeter", function () {
    beforeEach(async function () {
      const { greeter } = await this.loadFixture(deployGreeterFixture);
      this.greeter = greeter;
    });

    shouldBehaveLikeGreeter();
  });
});
