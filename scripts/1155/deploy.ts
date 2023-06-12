// import { fq1155Facet, fqSharedFacet } from "../../utils/paths";
import { ContractReceipt, Signer } from "ethers";
import { ethers, hardhatArguments } from "hardhat";

import { Diamond1155Init, Lively1155DiamondABI } from "../../types";
import { FacetCutAction, SelectorsObj, getSelectors } from "../libraries/diamond";
import { verifyDiamondDeploy, verifyFacetDeploy } from "./verificationFns";

export const logger = (...args: unknown[]) => {
  // Use this custom logger to disable logging when running tests
  if (process.env.LOG) console.log(...args);
};

export const oneHourFromNowInSeconds = Math.floor(new Date().getTime() / 1000) + 3600;
export const oneYearAgoInSeconds = Math.floor(new Date().getTime() / 1000) - 31536000;

export const defaultArgs: Diamond1155Init.DiamondArgsStruct = {
  _payees: ["0x208731e5331799D88B8B39E1A1182e90b05d94BA", "0x82b57d0b483fFE807E3947F2F8Ceb7896a16d79D"], // Primary
  _shares: [50, 50], // 100% // Primary
  _secondaryPayee: "0x208731e5331799D88B8B39E1A1182e90b05d94BA", // Secondary
  _secondaryShare: 500, // 5% // Secondary
  _airdrop: false,
  _name: "Foo",
  _symbol: "BAR",
  _contractURI: "https://golive.ly/meta/something",
  // _tokenData: [],
  _baseURI: "https://golive.ly/web3/meta/something/",
  _isPriceUSD: false,
  _automaticUSDConversion: false,
  _tokenData: [
    {
      maxSupply: 50,
      price: ethers.utils.parseEther("0.0001"),
      creator: "0x208731e5331799D88B8B39E1A1182e90b05d94BA",
      tokenUri: "",
      allowListEnabled: false,
      startTime: oneYearAgoInSeconds,
      isCrossmintUSDC: false,
    },
    {
      maxSupply: 100,
      price: ethers.utils.parseEther("0.00001"),
      creator: "0x208731e5331799D88B8B39E1A1182e90b05d94BA",
      tokenUri: "",
      allowListEnabled: false,
      startTime: oneYearAgoInSeconds,
      isCrossmintUSDC: false,
    },
    {
      maxSupply: 100000,
      price: ethers.utils.parseEther("0.00001"),
      creator: "0x208731e5331799D88B8B39E1A1182e90b05d94BA",
      tokenUri: "",
      allowListEnabled: false,
      startTime: oneYearAgoInSeconds,
      isCrossmintUSDC: false,
    },
  ],
};

const shouldVerify = hardhatArguments.network !== undefined && hardhatArguments.network !== "localhost";

type Opts = {
  isPriceUSD?: boolean;
  automaticUSDConversion?: boolean;
  isCrossmintUSDC?: boolean;
};
async function deployDiamond(owner?: Signer, livelyDev?: Signer, opts?: Opts): Promise<string> {
  logger({ hardhatArguments });
  logger("\nDeploying facets\n");
  const FacetNames = [
    "ERC1155Facet",
    "AllowListFacet",
    "DiamondCutFacet",
    "DiamondEtherscanFacet",
    "DiamondLoupeFacet",
    "OwnableFacet",
    "PausableFacet",
    "PaymentSplitterFacet",
    "RoyaltyFacet",

    "CrossmintFacet",
  ];

  if (!owner) owner = (await ethers.getSigners())[0];
  if (!livelyDev) livelyDev = (await ethers.getSigners())[1];

  const ownerAddress = await owner.getAddress();
  const livelyDevAddress = await livelyDev.getAddress();
  defaultArgs._payees = [ownerAddress, livelyDevAddress];
  defaultArgs._secondaryPayee = ownerAddress;
  defaultArgs._isPriceUSD = opts?.isPriceUSD ?? false;
  defaultArgs._automaticUSDConversion = opts?.automaticUSDConversion ?? false;

  if (opts?.isCrossmintUSDC) {
    defaultArgs._tokenData.forEach((token) => {
      token.isCrossmintUSDC = true;
    });
  }

  // // These facets have extra "supportsInterface(bytes4)" that can not be added to diamond.
  const FacetsWithExtra165 = ["ERC1155Facet", "RoyaltyFacet"];

  const cut: Array<{
    facetAddress: string;
    action: number;
    functionSelectors: SelectorsObj;
  }> = [];

  // Deploy DiamondInit
  const DiamondInit = await ethers.getContractFactory("Diamond1155Init");
  const diamondInit = await DiamondInit.deploy();

  const diamondInitAddress = diamondInit.address;

  // Deploy Facets
  for (const FacetName of FacetNames) {
    logger("Getting Contract Factory:", FacetName);
    const Facet = await ethers.getContractFactory(FacetName);
    logger("Get current nonce...");
    const nonce = await (await ethers.getSigners())[0].getTransactionCount();
    logger("Nonce should be: ", nonce, "\n");

    logger("Deploying:", FacetName);

    const facet = await Facet.deploy({
      nonce,
      gasLimit: 15e6,
      gasPrice: 533607999999,
    });

    // logger("Wait for two block to be mined");
    await facet.deployed();
    logger("Deployed (" + facet.address + "), waiting for block to be mined");

    if (shouldVerify) {
      const receipt: ContractReceipt = await facet.deployTransaction.wait(2);
      logger("TX Hash: ", receipt.transactionHash);
      logger("Waited for one block to be mined");
    }

    logger(`${FacetName} deployed: ${facet.address}\n`);

    if (shouldVerify) {
      await verifyFacetDeploy(facet, FacetName);
    }

    if (FacetName === "CrossmintFacet") {
      cut.push({
        facetAddress: facet.address,
        action: FacetCutAction.Add,
        functionSelectors: getSelectors(facet).get([
          "crossmintMint(address,uint256,uint256)",
          "crossmintPackMint(address,uint256,uint256)",
          "mint(address,uint256,uint256,uint8)",
        ]),
      });
    } else {
      const facetsToRemove = FacetsWithExtra165.includes(FacetName) ? ["supportsInterface(bytes4)"] : [];
      cut.push({
        facetAddress: facet.address,
        action: FacetCutAction.Add,
        functionSelectors: getSelectors(facet).remove(facetsToRemove),
      });
    }
  }

  logger("About to encode function calls");
  const functionCall = diamondInit.interface.encodeFunctionData("init", [defaultArgs]);
  logger("Function call encoded: ", functionCall);
  const Diamond = await ethers.getContractFactory("Lively1155Diamond");
  const diamond = (await Diamond.deploy(cut, diamondInitAddress, functionCall)) as Lively1155DiamondABI;
  logger("-defaultArgs-");
  logger(JSON.stringify(defaultArgs, null, 2));
  logger("-cut-");
  logger(JSON.stringify(cut, null, 2));
  await diamond.deployed();
  if (shouldVerify) {
    await verifyDiamondDeploy(diamond, "Lively1155Diamond", [defaultArgs, cut]);
  }
  logger("Diamond deployed:", diamond.address);

  // // Call Diamond Init
  // logger("Diamond cut (init");
  // // const functionCall = diamondInit.interface.encodeFunctionData("init");
  // const diamondCutFacet = (await ethers.getContractAt(
  //   "DiamondCutFacet",
  //   diamond.address
  // )) as DiamondCutFacet;
  // const tx = await diamondCutFacet.diamondCut(
  //   [],
  //   diamondInitAddress,
  //   functionCall
  // );

  // logger("Diamond cut tx: ", tx.hash);
  // const receipt = await tx.wait();
  // if (!receipt.status) {
  //   throw Error(`Diamond upgrade failed: ${tx.hash}`);
  // }
  // logger("Completed diamond cut");

  return diamond.address;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  deployDiamond()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { deployDiamond };
