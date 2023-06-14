import { generateContractList } from "./generators";

/**
 * This is a helper script to generate the list of contracts to be compiled.
 * We list them individually so that we can import their specific build artifacts.
 * If we don't do this, we get a single build artifact for all contracts which makes verification
 * and compilation a little more difficult later on.
 */
const createContractList = async () => {
  await generateContractList();
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
if (require.main === module) {
  createContractList()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
