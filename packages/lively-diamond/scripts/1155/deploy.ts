import { abi, bytecode } from "$artifacts/contracts/ERC1155-Diamond/Lively1155Diamond.sol/Lively1155Diamond.json";
import { abi as initAbi } from "$artifacts/contracts/ERC1155-Diamond/upgradeInitializers/Diamond1155Init.sol/Diamond1155Init.json";
import { Abi, Hex, createPublicClient, createWalletClient, encodeFunctionData, http } from "viem";
import { mnemonicToAccount } from "viem/accounts";
import { localhost } from "viem/chains";

import { cut1155, diamond1155Init } from "../../diamond-cut";
import { defaultArgs } from "./defaultArgs";

export const logger = (...args: unknown[]) => {
  // Use this custom logger to disable logging when running tests
  if (process.env.LOG) console.log(...args);
};

type Opts = {
  isPriceUSD?: boolean;
  automaticUSDConversion?: boolean;
  isCrossmintUSDC?: boolean;
};

// type DeployAccount = PrivateKeyAccount | HDAccount;
// async function deployDiamond(deployer: DeployAccount, livelyDev: DeployAccount, opts?: Opts): Promise<string> {
export async function deployDiamond(opts?: Opts): Promise<Hex> {
  const deployer = mnemonicToAccount(process.env.MNEMONIC as string);
  const livelyDev = mnemonicToAccount(process.env.MNEMONIC as string, {
    accountIndex: 1,
  });

  defaultArgs._payees = [deployer.address, livelyDev.address];
  defaultArgs._secondaryPayee = deployer.address;
  defaultArgs._isPriceUSD = opts?.isPriceUSD ?? false;
  defaultArgs._automaticUSDConversion = opts?.automaticUSDConversion ?? false;

  if (opts?.isCrossmintUSDC) {
    defaultArgs._tokenData.forEach((token) => {
      token.isCrossmintUSDC = true;
    });
  }

  const publicClient = createPublicClient({
    chain: localhost,
    transport: http(),
  });
  const client = createWalletClient({
    account: deployer,
    chain: localhost,
    transport: http(),
  });

  // Deploy DiamondInit
  console.log("++++++++Deploying DiamondInit++++++++");
  const abi2 = JSON.parse(JSON.stringify(abi)) as Abi;
  const initAbi2 = JSON.parse(JSON.stringify(initAbi)) as Abi;
  // if (abi2) {
  //   abi2 = abi2 as object;
  //   abi2 = JSON.parse(JSON.stringify(abi2));
  // }

  // if (initAbi2) {
  //   initAbi2 = initAbi2 as object;
  //   initAbi2 = JSON.parse(JSON.stringify(initAbi2));
  // }

  console.log({ abi2 });
  const functionCallData = encodeFunctionData({
    abi: initAbi2,
    functionName: "init",
    args: [defaultArgs],
  });
  const hash = await client.deployContract({
    abi: abi2,
    args: [cut1155, diamond1155Init, functionCallData],
    bytecode: bytecode as Hex,
  });

  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  if (!receipt.contractAddress) throw new Error("No contract address");

  return receipt.contractAddress;
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
