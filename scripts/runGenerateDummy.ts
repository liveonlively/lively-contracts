import * as fs from "fs";

import { fetchFacets } from "./dummyDiamond/fetchFacets";
import { generateDummyContract } from "./dummyDiamond/generateDummyContract";

// pnpm generate:dummy 0xACTUAL_DIAMOND_ADDDESS NETWORK_NAME CONTRACT TYPE
const main = async () => {
  const diamondAddress = "0x0000000000000000000000000000000000000000";
  const network = "localhost";
  const contractTypes = ["1155", "721"];

  if (!diamondAddress || !network) {
    throw new Error("missing argument");
  }

  for (const contractType of contractTypes) {
    try {
      const facets = await fetchFacets(contractType);

      const contractString = generateDummyContract(facets, {
        network,
        diamondAddress,
        solidityVersion: "^0.8.18",
        contractName: `DummyDiamond${contractType}Implementation`,
      });

      fs.writeFileSync(`./contracts/dummy/DummyDiamond${contractType}Implementation.sol`, contractString);
    } catch (error) {
      console.error(error);
    }
  }
};

main().catch(console.error);
