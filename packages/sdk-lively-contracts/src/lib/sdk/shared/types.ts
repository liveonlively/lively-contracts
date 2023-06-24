import type { Hex } from 'viem';
import type { LivelyDiamondSDK } from '../LivelyDiamondSDK.js';

export enum SupportedNetworks {
	MAINNET = 'mainnet',
	GOERLI = 'goerli',
	SEPOLIA = 'sepolia',
	MUMBAI = 'polygonMumbai',
	POLYGON = 'polygon',
	LOCALHOST = 'localhost'
}

export interface LivelyDiamondSDKOptions {
	// network: SupportedNetworks;
	privateKey?: Hex;
}
