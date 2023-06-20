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

class LivelyDiamondFactory {
	address: string | undefined;
	network: SupportedNetworks | undefined;
	private privateKey: string | undefined;

	constructor(network: SupportedNetworks = SupportedNetworks.MAINNET) {
		if (!Object.values(SupportedNetworks).includes(network)) throw new Error('Invalid network');

		this.network = network;
	}

	// Read only properties

	// Write properties (needs a signer)
}

export default LivelyDiamondFactory;
