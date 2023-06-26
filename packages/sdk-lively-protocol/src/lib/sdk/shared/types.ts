import type { Hex } from 'viem';

import {
	polygonMumbai,
	type Chain,
	localhost,
	polygon,
	sepolia,
	mainnet,
	goerli
} from 'viem/chains';

type valueOf<T> = T[keyof T];

export const SupportedNetworks: Record<string, Chain> = {
	MUMBAI: polygonMumbai,
	LOCALHOST: localhost,
	POLYGON: polygon,
	SEPOLIA: sepolia,
	MAINNET: mainnet,
	GOERLI: goerli
};

export interface LivelyDiamondSDKOptions {
	contractAddress?: Hex;
	mnemonic?: string;
	privateKey?: Hex;
}

export type SupportedNetworksType = valueOf<typeof SupportedNetworks>;
