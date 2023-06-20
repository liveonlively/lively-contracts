/**
 * LivelyDiamond SDK
 */

export enum SupportedNetworks {
	MAINNET = 'mainnet',
	GOERLI = 'goerli',
	SEPOLIA = 'sepolia',
	MUMBAI = 'mumbai',
	MATIC = 'matic'
}

// interface LivelyDiamondFactoryConstructor {
// 	address?: string;
// 	network?: SupportedNetwork;
// 	privateKey?: string;
// }

class LivelyDiamondFactory {
	address: string | undefined;
	network: SupportedNetworks | undefined;
	privateKey: string | undefined;

	constructor(network: SupportedNetworks = SupportedNetworks.GOERLI) {
		this.network = network;
	}

	// Read only properties

	// Write properties (needs a signer)
}

export default LivelyDiamondFactory;
