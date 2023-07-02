import fs from "fs";
import { globSync } from "glob";

const main = async () => {
  const eipTypes = ["Lively1155Diamond", "LivelyDiamond"];

  for (const eipType of eipTypes) {
    const bin = globSync(`**/${eipType}.bin`, { cwd: "bytecode/", absolute: true })[0];
    const abi = globSync(`**/${eipType}.json`, { cwd: "abi/json/contracts", absolute: true })[0];

    console.log({ bin, abi });
    const binContents = fs.readFileSync(bin, "utf8");
    const abiContents = fs.readFileSync(abi, "utf8");

    const combinedFile = `export const abi = ${abiContents};

  export const bytecode = "${binContents}";
  `;

    fs.writeFileSync(`abi-bytecode/${eipType}.ts`, combinedFile);

    console.log({ binContents, abiContents });
  }
};

main().catch(console.error);
