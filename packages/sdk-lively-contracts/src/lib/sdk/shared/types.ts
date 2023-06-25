import type { Hex } from 'viem';
import {
	mainnet,
	goerli,
	sepolia,
	polygonMumbai,
	polygon,
	localhost,
	type Chain
} from 'viem/chains';

type valueOf<T> = T[keyof T];

export const SupportedNetworks: Record<string, Chain> = {
	MAINNET: mainnet,
	GOERLI: goerli,
	SEPOLIA: sepolia,
	MUMBAI: polygonMumbai,
	POLYGON: polygon,
	LOCALHOST: localhost
};

export interface LivelyDiamondSDKOptions {
	// network: SupportedNetworks;
	privateKey?: Hex;
}

export type SupportedNetworksType = valueOf<typeof SupportedNetworks>;
