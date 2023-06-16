// // import { Contract } from "ethers";
// import { describeBehaviorOfOwnable } from "@solidstate/spec";
// import { ethers } from "hardhat";

// describe("Ownable", function () {
//   let instance: any;

//   beforeEach(async function () {
//     const factory = await ethers.getContractFactory("OwnableFacet");
//     instance = (await factory.deploy()) as any;
//     await instance.deployed();
//   });

//   describeBehaviorOfOwnable(
//     {
//       deploy: () => instance,
//     },
//     ["getOwner"],
//   );

//   // custom tests...
// });
