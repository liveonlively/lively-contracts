import { Contract, ContractFactory, ethers } from "ethers";

type Facets = { facetAddress: string; functionSelectors: string[] }[];

export const FacetCutAction = { Add: 0, Replace: 1, Remove: 2 };

export interface SelectorsObj extends Array<string> {
  get: typeof get;
  remove: typeof remove;
  contract: Contract | ContractFactory;
}

// get function selectors from ABI
export function getSelectors(contract: Contract | ContractFactory): SelectorsObj {
  const signatures = Object.keys(contract.interface.functions);
  const selectors = signatures.reduce<string[]>((acc, val) => {
    if (val !== "init(bytes)") {
      acc.push(contract.interface.getSighash(val));
    }
    return acc;
  }, []) as SelectorsObj;

  selectors.contract = contract;
  selectors.remove = remove;
  selectors.get = get;

  return selectors;
}

// get function selector from function signature
export function getSelector(func: string) {
  const abiInterface = new ethers.utils.Interface([func]);
  return abiInterface.getSighash(ethers.utils.Fragment.from(func));
}

// used with getSelectors to remove selectors from an array of selectors
// functionNames argument is an array of function signatures
export function remove(this: SelectorsObj, functionNames: string[]) {
  const selectors = this.filter((v: any) => {
    for (const functionName of functionNames) {
      if (v === this.contract?.interface.getSighash(functionName)) {
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
      if (v === this.contract?.interface.getSighash(functionName)) {
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
  const iface = new ethers.utils.Interface(signatures.map((v: any) => "function " + v));
  const removeSelectors = signatures.map((v: any) => iface.getSighash(v));
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
