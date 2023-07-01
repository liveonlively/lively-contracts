import { Hex, createPublicClient, createWalletClient, http } from "viem";
import { mnemonicToAccount } from "viem/accounts";
import { localhost } from "viem/chains";

// import * as abi from "../../abi/json/hardhat-diamond-abi/HardhatDiamondABI.sol/Lively1155DiamondABI.json";
import { abi, bytecode } from "../../artifacts/contracts/ERC1155-Diamond/Lively1155Diamond.sol/Lively1155Diamond.json";
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
  let abi2 = JSON.parse(JSON.stringify(abi));
  if (abi2) {
    abi2 = abi2 as object;
    abi2 = JSON.parse(JSON.stringify(abi2));
  }
  console.log({ abi2 });
  const hash = await client.deployContract({
    abi: abi2,
    args: [defaultArgs],
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
