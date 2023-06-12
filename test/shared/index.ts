import { ethers } from "hardhat";
import type { BigNumber } from "ethers";

const OWNER_ADDRESS = "0x208731e5331799D88B8B39E1A1182e90b05d94BA";
const SECONDARY_ADDR = "0x82b57d0b483fFE807E3947F2F8Ceb7896a16d79D";

const valueToEther = (value: string): BigNumber => ethers.utils.parseUnits(value, "ether");

const minimumArgs: any = [
  ["TestContract V1", "TCV1"],
  "https://golive.ly/tokenuri/",
  "https://golive.ly/tokenuri",
  100,
  OWNER_ADDRESS,
  500, // 5%
];

const fullArgs: any = [...minimumArgs, valueToEther("0.005"), [OWNER_ADDRESS, SECONDARY_ADDR], [30, 70]];

const packArgs: any = [...fullArgs, 10];

export { valueToEther, fullArgs, minimumArgs, packArgs };
