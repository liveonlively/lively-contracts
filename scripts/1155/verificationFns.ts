import { Contract } from "ethers";
import { hardhatArguments, run } from "hardhat";

interface EtherscanVerificationError {
  name: string;
  _stack: string;
  pluginName: string;
  _isHardhatPLuginError: boolean;
  shouldBeReported: boolean;
  _isNomicLabsHardhatPluginError: boolean;
}

enum ErrorStatus {
  NoBytecode = "NoBytecode",
  AlreadyVerified = "AlreadyVerified",
  Unknown = "Unknown",
}
interface ErrorResponse {
  reason: string;
  code: ErrorStatus;
}
export async function verifyFacetDeploy(facet: Contract, facetName: string) {
  // !alreadyVerified.includes(facetName)
  if (hardhatArguments.network !== "localhost") {
    try {
      console.log("Start verification process for: " + facetName);
      await run("verify:verify", {
        address: facet.address,
        contract: facetName,
      });
    } catch (e) {
      const { reason, code } = parseVerificationError(e);

      console.log(`Verification failed (Facet ${facetName}): ${reason}}`);

      if (code === ErrorStatus.NoBytecode) {
        setTimeout(async () => {
          console.log("Wait 5 seconds and retry");
          await verifyFacetDeploy(facet, facetName);
        }, 5000);
      }
    }
  }
}

function parseVerificationError(e: unknown): ErrorResponse {
  const err = e as EtherscanVerificationError;

  let errorReason: string;
  let code: ErrorStatus;
  if (err._stack.includes("does not have bytecode")) {
    errorReason = "Contract does not have bytecode";
    code = ErrorStatus.NoBytecode;
  } else if (err._stack.includes("Already Verified")) {
    errorReason = "Already Verified";
    code = ErrorStatus.AlreadyVerified;
  } else {
    errorReason = "Unknown Error";
    code = ErrorStatus.Unknown;
  }
  return { reason: errorReason, code };
}

export async function verifyDiamondDeploy(facet: Contract, facetName: string, args: unknown[]) {
  if (hardhatArguments.network !== "localhost") {
    try {
      console.log("verifyDiamondDeploy..." + facetName);
      await facet.deployTransaction.wait(1);
      await run("verify:verify", {
        address: facet.address,
        contract: `contracts/ERC1155-Diamond/${facetName}.sol:${facetName}`,
        constructorArguments: args,
      });
    } catch (e) {
      const { reason, code } = parseVerificationError(e);

      console.log(`Verification failed (Facet ${facetName}): ${reason}, ${code}`);

      if (code === ErrorStatus.NoBytecode) {
        console.log("About to retry");

        await new Promise(function (resolve) {
          setTimeout(resolve, 5 * 1000);
        });

        await verifyFacetDeploy(facet, facetName);
      }
    }
  }
}
