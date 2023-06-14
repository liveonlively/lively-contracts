import { Contract, FunctionFragment, ParamType } from "ethers";

type GenerateContractParams = {
  diamondAddress: string;
  network: string;
  spdxIdentifier?: string;
  solidityVersion?: string;
  contractName?: string;
};

type GetContractStringParams = GenerateContractParams & {
  signatures: string[];
  structs: string[];
};

export const generateDummyContract = (
  facetList: Contract[],
  { spdxIdentifier, solidityVersion, diamondAddress, network, contractName }: GenerateContractParams,
): string => {
  const structs = facetList
    .reduce((structsArr: any, contract) => {
      console.log({ contract, structsArr });
      return [...structsArr, ...getFormattedStructs(contract)];
    }, [])
    .filter(dedoop);
  console.log({ structs });
  const signatures = facetList
    .reduce((signaturesArr: any, contract) => {
      return [...signaturesArr, ...getFormattedSignatures(contract)];
    }, [])
    .filter(dedoop);

  const str = getContractString({
    spdxIdentifier,
    solidityVersion,
    diamondAddress,
    signatures,
    structs,
    network,
    contractName,
  });

  return str;
};

const getContractString = ({
  spdxIdentifier,
  solidityVersion,
  signatures,
  structs,
  contractName,
}: GetContractStringParams) => `
// SPDX-License-Identifier: ${spdxIdentifier || "MIT"}
pragma solidity ${solidityVersion || "^0.8.0"};

/**
 * This is a generated dummy diamond implementation for compatibility with
 * etherscan. For full contract implementation, check out the diamond on louper:
 * https://louper.dev/
 */

contract ${contractName || "DummyDiamond721Implementation"} {
${structs.reduce((all, struct) => {
  return `${all}\n\n${struct}`;
}, "")}
${signatures.reduce((all, sig) => {
  return `${all || "    "}${"\n\n"}   ${sig}`;
}, "")}
}
`;

const getFormattedSignatures = (facet: Contract) => {
  // const signatures = Object.keys(facet.interface.functions);
  console.log("------Inside getFormattedSignatures------");
  const signatures: FunctionFragment[] = Object.values(facet.interface.fragments).filter(
    (fragment) => fragment.type === "function",
  ) as FunctionFragment[];

  console.log({ signatures: JSON.stringify(signatures, null, 2) });

  return signatures.map((signature) => formatSignature(signature));
};

const formatSignature = (func: FunctionFragment) => {
  console.log("Inside formatSignature");
  // const paramsString = formatParams(func.inputs);
  const paramsString = func.inputs.reduce((currStr, param, i) => {
    return `${currStr}${param.type} ${param.name}${i < func.inputs.length - 1 ? ", " : ""}`;
  }, "");
  console.log({ paramsString });
  if (!func.outputs) return new Error("No outputs");
  const outputStr = formatParams(func.outputs);
  console.log({ outputStr });

  const stateMutability = func.stateMutability === "nonpayable" ? "" : ` ${func.stateMutability}`;
  console.log({ stateMutability });
  const outputs = outputStr ? ` returns (${outputStr})` : "";
  console.log({ outputs });

  return `function ${func.name}(${paramsString}) external${stateMutability}${outputs} {}`;
};

const formatParams = (params: readonly ParamType[]): string => {
  const paramsString = params.reduce((currStr, param, i) => {
    const comma = i < params.length - 1 ? ", " : "";
    const formattedType = formatType(param);
    const name = param.name ? ` ${param.name}` : "";

    return `${currStr}${formattedType}${name}${comma}`;
  }, "");

  return paramsString;
};

const formatType = (type: ParamType) => {
  console.log("Inside formatType: ", { type });
  const storageLocation = getStorageLocationForType(type.type);
  console.log({ storageLocation });
  const arrString = getArrayString(type);
  console.log({ arrString });
  const formattedType = type.components ? getTupleName(type) + arrString : type.type;
  console.log({ formattedType });

  return `${formattedType} ${storageLocation}`;
};

const getArrayString = (type: ParamType): string => {
  if (!type.arrayLength) {
    return "";
  }

  if (type.arrayLength === -1) {
    return "[]";
  }

  return `[${type.arrayLength}]`;
};

const getStorageLocationForType = (type: string): string => {
  // check for arrays
  if (type.indexOf("[") !== -1) {
    return "memory";
  }

  // check for tuples
  if (type.indexOf("tuple") !== -1) {
    return "memory";
  }

  switch (type) {
    case "bytes":
    case "string":
      return "memory";
    default:
      return "";
  }
};

// deterministic naming convention
const getTupleName = (param: ParamType) => {
  return "Tuple" + hashCode(JSON.stringify(param));
};

function hashCode(str: string) {
  let hash = 0;
  for (let i = 0, len = str.length; i < len; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString().substring(3, 10);
}

// declare structs used in function arguments
const getFormattedStructs = (facet: Contract) => {
  console.log("Generating structs for facet: ", facet, "...");

  const funcs: FunctionFragment[] = Object.values(facet.interface.fragments).filter(
    (fragment) => fragment.type === "function",
  ) as FunctionFragment[];

  console.log("Inside getFormattedStructs: ", { funcs });

  const inputStructs = funcs.reduce((inputStructsArr: any, func) => {
    return [...inputStructsArr, ...getFormattedStructsFromParams(func.inputs)];
  }, []);

  const outputStructs = funcs.reduce((outputStructsArr: any, func) => {
    if (!func.outputs) return new Error("No outputs");
    return [...outputStructsArr, ...getFormattedStructsFromParams(func.outputs)];
  }, []);

  console.log({ inputStructs, outputStructs });

  return [...inputStructs, ...outputStructs];
};

const getFormattedStructsFromParams = (params: readonly ParamType[]): string[] => {
  console.log("Inside getFormattedStructsFromParams");
  const formatStructResult = params
    .map(recursiveFormatStructs)
    .flat()
    .filter((str) => str.indexOf(" struct ") !== -1);
  console.log({ formatStructResult });

  return formatStructResult;
};

const recursiveFormatStructs = (param: ParamType): string[] => {
  // base case
  if (!param.components) {
    return [""];
  }

  const otherStructs = param.components
    .map(recursiveFormatStructs)
    .flat()
    .filter((str) => str.indexOf(" struct ") !== -1);

  const structMembers = param.components.map(formatStructMember);
  const struct = `    struct ${getTupleName(param)} {${structMembers.reduce(
    (allMembers, member) => `${allMembers}${member}`,
    "",
  )}\n    }`;

  return [struct, ...otherStructs];
};

const formatStructMember = (param: ParamType) => {
  const arrString = getArrayString(param);
  return `\n        ${param.components ? getTupleName(param) + arrString : param.type} ${param.name};`;
};

const dedoop = (str: string, index: number, allmembers: string[]) => {
  for (let i = 0; i < index; i++) {
    if (allmembers[i] === str) {
      return false;
    }
  }

  return true;
};
