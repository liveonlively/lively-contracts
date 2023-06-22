export type EthAddress = `0x${string}`;

export enum SupportedNetworks {
	MAINNET = 'mainnet',
	GOERLI = 'goerli',
	SEPOLIA = 'sepolia',
	MUMBAI = 'polygonMumbai',
	POLYGON = 'polygon',
	LOCALHOST = 'localhost'
}

export interface LivelyDiamondSDKOptions {
	network: SupportedNetworks;
	privateKey?: EthAddress;
}
