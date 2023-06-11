import "dotenv/config";

import hre from "hardhat";
import { Contract } from "ethers";
import {
  erc1155Facets,
  erc721Facets,
  sharedFacets,
} from "../../optimizationEnabled";

export const fetchFacets = async (
  contractType: string
): Promise<Contract[]> => {
  let facets: string[];
  if (contractType == "721") {
    facets = [...erc721Facets, ...sharedFacets];
  } else if (contractType == "1155") {
    facets = [...erc1155Facets, ...sharedFacets];
  } else {
    throw new Error("Invalid contract type");
  }

  facets = facets.map((f) => f.substring(0, f.length - 4));

  console.log({ facets });

  const allContracts = [];
  for (const facetName of facets) {
    const Contract = await hre.ethers.getContractFactory(facetName);
    const contract = await Contract.deploy();

    allContracts.push(contract);
  }

  return allContracts;
};
