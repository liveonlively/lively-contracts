import type { Hex } from 'viem';

import {
	type Chain,
	goerli,
	localhost,
	mainnet,
	polygon,
	polygonMumbai,
	sepolia,
} from 'viem/chains';

type valueOf<T> = T[keyof T];

export const SupportedNetworks: Record<string, Chain> = {
	GOERLI: goerli,
	LOCALHOST: localhost,
	MAINNET: mainnet,
	MUMBAI: polygonMumbai,
	POLYGON: polygon,
	SEPOLIA: sepolia,
};

export interface LivelyDiamondSDKOptions {
	mnemonic?: string;
	privateKey?: Hex;
}

export interface LivelyDiamondContractOptions extends LivelyDiamondSDKOptions {
	address?: Hex;
	network?: SupportedNetworksType;
}

export type SupportedNetworksType = valueOf<typeof SupportedNetworks>;
