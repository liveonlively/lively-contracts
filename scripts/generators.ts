import { readdir, writeFile } from "fs/promises";
import { join, resolve } from "path";

// TODO: Use glob instead of this function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function* getFiles(dir: string): any {
  const dirents = await readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

/**
 * Creates a new version of the optimizationEnabled.ts file that contains the list of contracts to be compiled.
 * Searches through the contracts directory for .sol contracts that need to be compiled and automatically generates
 * the list that we use in hardhat.config.ts so that each contract has it's own artifact.
 */
export const generateContractList = async () => {
  const directoryPath721 = join(__dirname, "..", "contracts", "ERC721-Diamond");
  const directoryPath1155 = join(__dirname, "..", "contracts", "ERC1155-Diamond");
  const directoryPathShared = join(__dirname, "..", "contracts", "shared");
  // const contractsPathDummy = join(__dirname, "..", "contracts", "dummy");

  let fileData = "";
  fileData += `export const optimizationEnabled = <const>[\n`;
  for await (const f of getFiles(directoryPath721)) {
    const relativeName = f.replace(directoryPath721, "contracts/ERC721-Diamond");
    if (relativeName.includes(".sol")) {
      fileData += `  "${relativeName}",\n`;
    }
  }

  for await (const f of getFiles(directoryPath1155)) {
    const relativeName = f.replace(directoryPath1155, "contracts/ERC1155-Diamond");
    if (relativeName.includes(".sol")) {
      fileData += `  "${relativeName}",\n`;
    }
  }

  for await (const f of getFiles(directoryPathShared)) {
    const relativeName = f.replace(directoryPathShared, "contracts/shared");
    if (relativeName.includes(".sol")) {
      fileData += `  "${relativeName}",\n`;
    }
  }

  // for await (const f of getFiles(contractsPathDummy)) {
  //   const relativeName = f.replace(contractsPathDummy, "contracts/dummy");
  //   if (relativeName.includes(".sol")) {
  //     fileData += `  "${relativeName}",\n`;
  //   }
  // }

  fileData += `];

export const erc721Facets = optimizationEnabled
  .filter((path) => path.startsWith("contracts/ERC721-Diamond/facets/"))
  .map((path) => path.replace("contracts/ERC721-Diamond/facets/", ""))
  .concat(["DummyDiamond721Implementation.sol"]);

export const erc1155Facets = optimizationEnabled
  .filter((path) => path.startsWith("contracts/ERC1155-Diamond/facets/"))
  .map((path) => path.replace("contracts/ERC1155-Diamond/facets/", ""))
  .concat(["DummyDiamond1155Implementation.sol"]);

export const sharedFacets = optimizationEnabled
  .filter((path) => path.startsWith("contracts/shared/facets/"))
  .map((path) => path.replace("contracts/shared/facets/", ""));

`;

  const promise = writeFile("optimizationEnabled.ts", fileData);
  await promise;
};

/**
 * Generates the deploy files for all the facets
 */
export const generateFacetDeploys = async () => {
  console.log("Starting to generate facets...");
  const deployDir = join(__dirname, "..", "deploy");
  interface ContractInfo {
    facet: string;
    tags: string[];
  }
  const contractInfo: ContractInfo[] = [
    { facet: "AllowListFacet", tags: ["Facets"] }, // Shared
    { facet: "DiamondCutFacet", tags: ["Facets"] }, // Shared
    { facet: "DiamondLoupeFacet", tags: ["Facets"] }, // Shared
    { facet: "OwnableFacet", tags: ["Facets"] }, // Shared
    { facet: "PausableFacet", tags: ["Facets"] }, // Shared
    { facet: "PaymentSplitterFacet", tags: ["Facets"] }, // Shared
    { facet: "DiamondEtherscanFacet", tags: ["Facets"] }, // Shared
    { facet: "RoyaltyFacet", tags: ["Facets"] }, // Shared
    { facet: "EditionsFacet", tags: ["Facets"] }, // ERC721
    { facet: "ERC721AFacet", tags: ["Facets"] }, // ERC721
    { facet: "QueryableFacet", tags: ["Facets"] }, // ERC721
    { facet: "ERC1155Facet", tags: ["Facets"] }, // ERC1155

    { facet: "Diamond1155Init", tags: ["Facets", "Init"] }, // ERC1155
    { facet: "DummyDiamond721Implementation", tags: ["Facets", "Dummy"] }, // ERC721
    { facet: "DummyDiamond1155Implementation", tags: ["Facets", "Dummy"] }, // ERC1155
    { facet: "CrossmintFacet", tags: ["Facets"] }, // ERC1155
  ];

  let i = 1;
  for (const { facet, tags } of contractInfo) {
    console.log("Generating deploy for: ", facet);
    const fileData = `import {
  DeployFunction,
  DeployOptions,
  DeployResult,
} from "hardhat-deploy/types";
import { BigNumber } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import type { NomicLabsHardhatPluginError } from "hardhat/internal/core/errors";

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
    deployOptions.maxFeePerGas = BigNumber.from(36_000_000_000);
  }

  let deployAttempt = 0;
  let newlyDeployed: DeployResult | undefined = undefined;
  while (!newlyDeployed) {
    console.log("Deploy attempt (${facet}): ", deployAttempt++);
    try {
      newlyDeployed = await deploy("${facet}", deployOptions);
    } catch (e) {
      console.log("Error deploying: ", e);
      console.log("Try again in 5");
      // Wait 5 seconds and try again
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  console.log("${facet}: ", {
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

      console.log(\`Waiting for \${waitTime} confirmations...\`);

      await tx.wait(waitTime);
    }

    console.log("Verifying ${facet}...");
    const artifact = await deployments.getArtifact("${facet}");

    try {
      await hre.run("verify:verify", {
        address: newlyDeployed.address,
        contract: \`\${artifact.sourceName}:\${artifact.contractName}\`,
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
func.tags = ${JSON.stringify(tags).replaceAll(",", ", ")};
`;

    await writeFile(`${deployDir}/${pad(i, 3)}_deploy_${facet.toLocaleLowerCase()}.ts`, fileData);
    i++;
  }
};

function pad(num: number, size: number): string {
  let strNum = num.toString();
  while (strNum.length < size) strNum = "0" + strNum;
  return strNum;
}
