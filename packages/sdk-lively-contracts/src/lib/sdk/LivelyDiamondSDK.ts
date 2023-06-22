import type { PrivateKeyAccount } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { SDKValidator, isValidNetwork, isValidPrivateKey } from './shared/decorators.js';
import {
	SupportedNetworks,
	type LivelyDiamondSDKOptions,
	type EthAddress
} from './shared/types.js';

/**
 * LivelyDiamond SDK
 */

const defaultOpts = {
	network: SupportedNetworks.MAINNET,
	privateKey: undefined
};

// { network, privateKey }: LivelyDiamondSDKOptions = {
//   network: SupportedNetworks.MAINNET
// }

@SDKValidator
export class LivelyDiamondSDK {
	network: SupportedNetworks | undefined;
	account: PrivateKeyAccount | undefined;

	constructor({ network, privateKey }: LivelyDiamondSDKOptions = defaultOpts) {
		this.network = network;
		this.account = privateKey ? privateKeyToAccount(privateKey) : undefined;
	}

	static fromPK(privateKey: EthAddress, opts = { network: SupportedNetworks.MAINNET }) {
		if (!isValidPrivateKey(privateKey)) throw new Error('Invalid PK');
		if (opts.network && !isValidNetwork(opts.network)) throw new Error('Invalid network');

		return new LivelyDiamondSDK({ network: opts.network, privateKey });
	}

	// Read only properties
	public getAccount() {
		return this.account;
	}

	// Write properties (needs a signer)
	public connectPK(privateKey: EthAddress) {
		if (!isValidPrivateKey(privateKey)) throw new Error('Invalid PK');
		this.account = privateKeyToAccount(privateKey);
	}
}
