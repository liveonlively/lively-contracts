/**
 * LivelyDiamond SDK
 */

type SupportedNetwork = 'mainnet' | 'goerli' | 'sepolia' | 'mumnbai' | 'matic';

// interface LivelyDiamondFactoryConstructor {
// 	address?: string;
// 	network?: SupportedNetwork;
// 	privateKey?: string;
// }

class LivelyDiamondFactory {
	address: string | undefined;
	network: SupportedNetwork | undefined;
	privateKey: string | undefined;

	constructor(network: SupportedNetwork) {
		this.network = network;
	}

	// Read only properties

	// Write properties (needs a signer)
}

export default LivelyDiamondFactory;
