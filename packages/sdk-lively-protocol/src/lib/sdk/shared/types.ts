import type { Hex } from 'viem';

import {
	type Chain,
	goerli,
	localhost,
	mainnet,
	polygon,
	polygonMumbai,
	sepolia
} from 'viem/chains';

type valueOf<T> = T[keyof T];

export const SupportedNetworks: Record<string, Chain> = {
	GOERLI: goerli,
	LOCALHOST: localhost,
	MAINNET: mainnet,
	MUMBAI: polygonMumbai,
	POLYGON: polygon,
	SEPOLIA: sepolia
};

export interface LivelyDiamondSDKOptions {
	contractAddress?: Hex;
	mnemonic?: string;
	privateKey?: Hex;
}

export type SupportedNetworksType = valueOf<typeof SupportedNetworks>;
