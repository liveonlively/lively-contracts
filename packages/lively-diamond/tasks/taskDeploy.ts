// TODO: Can probably delete this file from the original template repo.

// import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
// import { task } from "hardhat/config";
// import type { TaskArguments } from "hardhat/types";

// import type { Greeter } from "../types/Greeter";
// import type { Greeter__factory } from "../types/factories/Greeter__factory";

// task("task:deployGreeter")
//   .addParam("greeting", "Say hello, be nice")
//   .setAction(async function (taskArguments: TaskArguments, { ethers }) {
//     const signers: SignerWithAddress[] = await ethers.getSigners();
//     const greeterFactory: Greeter__factory = <Greeter__factory>await ethers.getContractFactory("Greeter");
//     const greeter: Greeter = <Greeter>await greeterFactory.connect(signers[0]).deploy(taskArguments.greeting);
//     await greeter.deployed();
//     console.log("Greeter deployed to: ", greeter.address);
//   });