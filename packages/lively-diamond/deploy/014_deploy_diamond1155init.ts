import { DeployFunction, DeployOptions, DeployResult } from "hardhat-deploy/types";
import type { NomicLabsHardhatPluginError } from "hardhat/internal/core/errors";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, getChainId, network } = hre;
  const { deploy } = deployments;

  const chainId = await getChainId();
  console.log({ live: network.live, chainId });
  const { deployer } = await getNamedAccounts();

  const deployOptions: DeployOptions = {
    from: deployer,
    args: [],
    log: true,
    deterministicDeployment: "0x1234",
  };

  if (chainId === "1") {
    console.log("Setting maxFeePerGas to 36 gwei (36_000_000_000) for mainnet");
    deployOptions.maxFeePerGas = "36000000000";
  }

  let deployAttempt = 0;
  let newlyDeployed: DeployResult | undefined = undefined;
  while (!newlyDeployed) {
    console.log("Deploy attempt (Diamond1155Init): ", deployAttempt++);
    try {
      newlyDeployed = await deploy("Diamond1155Init", deployOptions);
    } catch (e) {
      console.log("Error deploying: ", e);
      console.log("Try again in 5");
      // Wait 5 seconds and try again
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  console.log("Diamond1155Init: ", {
    address: newlyDeployed.address,
  });

  if (network.live) {
    if (newlyDeployed.receipt) {
      console.log("Receipt found");

      const deployHash = newlyDeployed.receipt.transactionHash;
      const tx = await hre.ethers.provider.getTransaction(deployHash);

      const ethWaitTime = 5;
      const polyWaitTime = 15;

      let waitTime: number;
      if (chainId === "137" || chainId === "80001") {
        waitTime = polyWaitTime;
      } else if (chainId === "1" || chainId === "5") {
        waitTime = ethWaitTime;
      } else {
        waitTime = ethWaitTime;
      }

      console.log(`Waiting for ${waitTime} confirmations...`);

      await tx.wait(waitTime);
    }

    console.log("Verifying Diamond1155Init...");
    const artifact = await deployments.getArtifact("Diamond1155Init");

    try {
      await hre.run("verify:verify", {
        address: newlyDeployed.address,
        contract: `${artifact.sourceName}:${artifact.contractName}`,
        network: hre.network,
      });
    } catch (e) {
      const error = e as NomicLabsHardhatPluginError;

      if (error.stack?.includes("Contract source code already verified")) {
        console.log("Already verified");
      } else {
        console.error("Error verifying: ", error);
      }
    }

    console.log("Verified");
  } else {
    console.log("Not verifying on non-live network");
  }
};
export default func;
func.tags = ["Facets", "Init"];
