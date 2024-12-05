import { ethers } from "ethers";

import { Diamond1155Init } from "../../types";

export const oneHourFromNowInSeconds = Math.floor(new Date().getTime() / 1000) + 3600;
export const oneYearAgoInSeconds = Math.floor(new Date().getTime() / 1000) - 31536000;

export const defaultArgs: Diamond1155Init.DiamondArgsStruct = {
  _payees: ["0x208731e5331799D88B8B39E1A1182e90b05d94BA", "0x82b57d0b483fFE807E3947F2F8Ceb7896a16d79D"], // Primary
  _shares: [50, 50], // 100% // Primary
  _secondaryPayee: "0x208731e5331799D88B8B39E1A1182e90b05d94BA", // Secondary
  _secondaryShare: 500, // 5% // Secondary
  _airdrop: false,
  _name: "Foo",
  _symbol: "BAR",
  _contractURI: "https://golive.ly/meta/something",
  // _tokenData: [],
  _baseURI: "https://golive.ly/web3/meta/something/",
  _isPriceUSD: false,
  _automaticUSDConversion: false,
  _tokenData: [
    {
      maxSupply: 50,
      price: ethers.parseEther("0.0001"),
      creator: "0x208731e5331799D88B8B39E1A1182e90b05d94BA",
      tokenUri: "",
      allowListEnabled: false,
      startTime: oneYearAgoInSeconds,
      isCrossmintUSDC: false,
    },
    {
      maxSupply: 100,
      price: ethers.parseEther("0.00001"),
      creator: "0x208731e5331799D88B8B39E1A1182e90b05d94BA",
      tokenUri: "",
      allowListEnabled: false,
      startTime: oneYearAgoInSeconds,
      isCrossmintUSDC: false,
    },
    {
      maxSupply: 100000,
      price: ethers.parseEther("0.00001"),
      creator: "0x208731e5331799D88B8B39E1A1182e90b05d94BA",
      tokenUri: "",
      allowListEnabled: false,
      startTime: oneYearAgoInSeconds,
      isCrossmintUSDC: false,
    },
  ],
};
