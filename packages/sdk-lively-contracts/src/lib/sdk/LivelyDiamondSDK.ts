import type { PrivateKeyAccount } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { SDKValidator } from './shared/decorators.js';
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

@SDKValidator
export class LivelyDiamondSDK {
	network: SupportedNetworks | undefined;
	account: PrivateKeyAccount | undefined;

	constructor({ network, privateKey }: LivelyDiamondSDKOptions = defaultOpts) {
		this.network = network;
		this.account = privateKey ? privateKeyToAccount(privateKey) : undefined;
	}

	static fromPK(privateKey: EthAddress, opts = { network: SupportedNetworks.MAINNET }) {
		return new LivelyDiamondSDK({ network: opts.network, privateKey });
	}

	// Read only properties
	public getAccount() {
		return this.account;
	}

	// Write properties (needs a signer)
	public connectPK(privateKey: EthAddress) {
		console.log({ privateKey });
		this.account = privateKeyToAccount(privateKey);
	}
}
