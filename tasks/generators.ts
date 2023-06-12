import "@nomiclabs/hardhat-ethers";
import { writeFile } from "fs/promises";
import { task } from "hardhat/config";
import { join } from "path";

import { erc721Facets, erc1155Facets, sharedFacets } from "../optimizationEnabled";
import { generateContractList, generateFacetDeploys } from "../scripts/generators";
import { FacetCutAction, SelectorsObj, getSelectors } from "../scripts/libraries/diamond";

task("generate:contract:list", "Generate the new contract list").setAction(async () => {
  await generateContractList();
});

task("generate:deploy:facets", "Generate the new contract list").setAction(async () => {
  await generateFacetDeploys();
});

task("generate:facet:cuts", "Generate the new cut file", async (_, hre) => {
  await hre.run("compile");
  const facets1155 = [...erc1155Facets, ...sharedFacets].map((x) => x.replace(".sol", ""));
  console.log({ facets1155 });
  const facets721 = [...erc721Facets, ...sharedFacets].map((x) => x.replace(".sol", ""));
  const { deployments } = hre;

  // Deploy Facets/Inits
  const cut1155 = await createCut(facets1155);
  const cut721 = await createCut(facets721);
  const diamond1155Init = await deployments.get("Diamond1155Init");

  const fileData = `export const cut1155 = ${JSON.stringify(cut1155, null, 2)};

export const cut721 = ${JSON.stringify(cut721, null, 2)};

export const diamond1155Init = "${diamond1155Init.address}";
    `;

  await writeFile(join(__dirname, "..", "diamond-cut.ts"), fileData);
  console.log("Wrote cut file");
});

async function createCut(facets: string[]) {
  const hre = await import("hardhat");
  const FacetsWithExtra165 = ["ERC1155Facet", "RoyaltyFacet"];
  const { deployments } = hre;
  const cut: Array<{
    facetAddress: string;
    action: number;
    functionSelectors: SelectorsObj;
  }> = [];

  for (const FacetName of facets) {
    const facetDeployment = await deployments.get(FacetName);
    const facet = await hre.ethers.getContractAt(FacetName, facetDeployment.address);

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

  console.log("Network: ", hre.network.name);

  return cut;
}
