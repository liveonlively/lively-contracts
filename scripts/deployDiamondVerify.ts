/* eslint-disable @typescript-eslint/naming-convention */
import { ethers, hardhatArguments, run } from "hardhat";
import { getSelectors } from "./libraries/diamond";
import { LivelyDiamond } from "../types";
import { logger } from "../scripts/1155/deploy";

export const FacetCutAction = { Add: 0, Replace: 1, Remove: 2 };

const FacetNames = <const>[
  "ERC721AFacet",
  "EditionsFacet",
  "QueryableFacet",
  "AllowListFacet",
  "DiamondCutFacet",
  "DiamondEtherscanFacet",
  "DiamondLoupeFacet",
  "OwnableFacet",
  "PausableFacet",
  "PaymentSplitterFacet",
  "RoyaltyFacet",
];

// // These facets have extra "supportsInterface(bytes4)" that can not be added to diamond.
const FacetsWithExtra165 = ["ERC1155Facet", "RoyaltyFacet"];

export const defaultArgs: LivelyDiamond.DiamondArgsStruct = {
  _owner: "0x208731e5331799D88B8B39E1A1182e90b05d94BA",
  _name: "Test Release",
  _symbol: "TR",
  _payees: ["0x208731e5331799D88B8B39E1A1182e90b05d94BA", "0x0A8b88D055089f05beA6c495e66D061dA254FceF"],
  _shares: ["50", "50"], // 100%
  _secondaryPayee: "0x208731e5331799D88B8B39E1A1182e90b05d94BA",
  _secondaryPoints: "500", // 5%
  _contractURI: "http://contract.uri",
  // _price: ethers.parseUnits("0.01", "ether"),
  _price: 7500, // $75.00
  _maxSupply: 100,
  _baseTokenUri: "https://soon.golive.ly/web3/meta/5af73739-e234-4b1d-b468-fb3461ed1de9/",
  _airdrop: false,
  _maxMintPerTx: 10,
  _maxMintPerAddress: 10,
  _allowListEnabled: false,
  // _isPriceUSD: false,
  _isPriceUSD: true,
  // _automaticUSDConversion: false,
  _automaticUSDConversion: true,
  _editions: [],
  _isSoulbound: false,
};

export type Opts = { verify: boolean; client?: boolean };
const defaultOpts: Opts = { verify: false, client: false };

export const deploy = async (args = defaultArgs, opts = defaultOpts): Promise<string> => {
  const cut = [];
  for (const FacetName of FacetNames) {
    const Facet = await ethers.getContractFactory(FacetName);
    const transactionResponse = await Facet.deploy();
    const deploymentTransaction = transactionResponse.deploymentTransaction();
    const facet = await transactionResponse.waitForDeployment();

    logger(`${FacetName} deployed: ${await facet.getAddress()}`);
    if (hardhatArguments.network !== "localhost" && opts.verify) {
      try {
        logger("Verifying...");
        await delay(5);
        await deploymentTransaction?.wait(5);
        await run("verify:verify", {
          address: await facet.getAddress(),
          contract: FacetName,
        });
      } catch (e) {
        logger("Verification failed: ", JSON.stringify(e, null, 2));
      }
    }

    const facetsToRemove = FacetsWithExtra165.includes(FacetName) ? ["supportsInterface(bytes4)"] : [];
    cut.push({
      facetAddress: await facet.getAddress(),
      action: FacetCutAction.Add,
      functionSelectors: getSelectors(Facet).remove(facetsToRemove),
    });
  }

  // const Diamond = await ethers.getContractFactory("LivelyDiamond");
  // const diamond = await Diamond.deploy(cut, args);

  const Diamond = await ethers.getContractFactory("LivelyDiamond");
  const transactionResponse = await Diamond.deploy(cut, args);
  const deploymentTransaction = transactionResponse.deploymentTransaction();
  const diamond = await transactionResponse.waitForDeployment();

  logger("Cuts: ", JSON.stringify(cut, null, 2));
  logger(`Diamond deployed: ${await diamond.getAddress()}`);
  if (hardhatArguments.network !== "localhost" && opts.verify)
    try {
      logger("Verifying...");
      logger("Cuts: ", JSON.stringify(cut, null, 2));
      logger("Args: ", JSON.stringify(args, null, 2));
      await delay(5);
      await deploymentTransaction?.wait(5);
      await run("verify:verify", {
        address: await diamond.getAddress(),
        contract: `contracts/ERC721-Diamond/LivelyDiamond.sol:LivelyDiamond`,
        constructorArguments: [cut, args],
      });
    } catch (e) {
      logger("Verification failed: ", JSON.stringify(e, null, 2));
    }

  return await diamond.getAddress();
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  deploy()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

function delay(n: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, n * 1000);
  });
}
