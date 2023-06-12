import { ethers } from "hardhat";

import { optimizationEnabled } from "../../optimizationEnabled";
import * as _AllTypes from "../../types";

export type DeployWaitType = ReturnType<typeof deployAndWait>;
/**
 * Deploy a contract and wait a certain amount of blocks for it to be deployed. (Ethers v6)
 *
 * @param contractName The name of the contract to be deployed.
 * @param waitTime How many blocks to wait for the contract to be deployed.
 * @param args Restful arguments for the arbitrary contract's deployment parameters.
 * @returns A type of BaseContract
 */
export const deployAndWait = async (contractName: string, waitTime = 1, ...args: unknown[]) => {
  // console.log("Getting all types...");
  // console.log({ AllTypes });
  // TODO: Fix this check with a better TypeScript guard.
  if (
    optimizationEnabled.findIndex((contractQualifiedAddress) => contractQualifiedAddress.includes(contractName)) === -1
  ) {
    throw new Error(`Contract ${contractName} is not in the optimizationEnabled array.`);
  }

  console.log("Getting Contract Factory:", contractName);
  const Contract = await ethers.getContractFactory(contractName);

  console.log("Get current nonce...");
  const nonce = await (await ethers.getSigners())[0].getNonce();
  console.log("Nonce should be: ", nonce, "\n");

  console.log("Deploying:", contractName);
  const transactionResponse = await Contract.deploy(...args, {
    nonce,
    gasLimit: 15e6,
    gasPrice: 533607999999,
  });

  const deploymentTransaction = transactionResponse.deploymentTransaction();
  if (!deploymentTransaction) throw new Error("No deployment transaction");

  console.log(`Waiting for ${waitTime} blocks...`);
  await deploymentTransaction.wait(waitTime);

  const contract = await transactionResponse.waitForDeployment();
  console.log(`Deployed to: ${await contract.getAddress()}`);

  return contract;
};
