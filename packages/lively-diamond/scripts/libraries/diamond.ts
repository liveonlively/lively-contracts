/* eslint-disable */
import { BaseContract, ContractTransactionResponse, FunctionFragment, ethers } from "ethers";

type Facets = { facetAddress: string; functionSelectors: string[] }[];
type WeirdContract = BaseContract & {
  deploymentTransaction(): ContractTransactionResponse;
} & Omit<BaseContract, keyof BaseContract>;
type ContractInput = WeirdContract | ethers.Contract;
export const FacetCutAction = { Add: 0, Replace: 1, Remove: 2 };

export interface SelectorsObj extends Array<string> {
  get: typeof get;
  remove: typeof remove;
  contract: ContractInput;
}

// get function selectors from ABI
// Old type Contract | ContractFactory
export function getSelectors(contract: ContractInput): SelectorsObj {
  const signatures: FunctionFragment[] = Object.values(contract.interface.fragments).filter(
    (fragment) => fragment.type === "function",
  ) as FunctionFragment[];

  const selectors = signatures.reduce<string[]>((acc, val) => {
    if (val.format("sighash") !== "init(bytes)") {
      acc.push(val.selector);
    }
    return acc;
  }, []) as SelectorsObj;
  console.log({ selectors });
  selectors.contract = contract;
  selectors.remove = remove;
  selectors.get = get;

  return selectors;
}

// get function selector from function signature
export function getSelector(func: string) {
  const abiInterface = new ethers.Interface([func]);
  return abiInterface.getFunction(func)?.selector;
}

// used with getSelectors to remove selectors from an array of selectors
// functionNames argument is an array of function signatures
export function remove(this: SelectorsObj, functionNames: string[]) {
  const selectors = this.filter((v: any) => {
    for (const functionName of functionNames) {
      // if (v === this.contract?.interface.getSighash(functionName)) {
      const functionSignature = this.contract?.interface.getFunction(functionName)?.selector;
      if (functionSignature)
        if (v === functionSignature) {
          return false;
        }
    }
    return true;
  }) as SelectorsObj;

  selectors.contract = this.contract;
  selectors.remove = this.remove;
  selectors.get = this.get;

  return selectors;
}

// used with getSelectors to get selectors from an array of selectors
// functionNames argument is an array of function signatures
export function get(this: SelectorsObj, functionNames: string[]) {
  const selectors = this.filter((v: any) => {
    for (const functionName of functionNames) {
      const functionSignature = this.contract?.interface.getFunction(functionName)?.selector;
      if (functionSignature)
        if (v === functionSignature) {
          return true;
        }
    }
    return false;
  }) as SelectorsObj;

  selectors.contract = this.contract;
  selectors.remove = this.remove;
  selectors.get = this.get;

  return selectors;
}

// remove selectors using an array of signatures
export function removeSelectors(selectors: string[], signatures: string[]) {
  const iface = new ethers.Interface(signatures.map((v: any) => "function " + v));
  const removeSelectors = signatures.map((v: any) => iface.getFunction(v)?.selector);
  selectors = selectors.filter((v: any) => !removeSelectors.includes(v));
  return selectors;
}

// find a particular address position in the return value of diamondLoupeFacet.facets()
export function findAddressPositionInFacets(facetAddress: string, facets: Facets): number {
  for (let i = 0; i < facets.length; i++) {
    if (facets[i].facetAddress === facetAddress) {
      return i;
    }
  }

  throw new Error("None number found");
}
