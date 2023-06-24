import type { PrivateKeyAccount, Hex } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { SDKValidator, CheckProperties } from './shared/decorators.js';
import { SupportedNetworks, type LivelyDiamondSDKOptions } from './shared/types.js';

/**
 * LivelyDiamond SDK
 */

const defaultOpts: LivelyDiamondSDKOptions = {
	privateKey: undefined
};

@SDKValidator
export class LivelyDiamondSDK {
	protected _network: SupportedNetworks | undefined;
	protected _account: PrivateKeyAccount | undefined;

	constructor(network = SupportedNetworks.MAINNET, opts = defaultOpts) {
		this._network = network;
		this._account = opts.privateKey ? privateKeyToAccount(opts.privateKey) : undefined;
	}

	static fromPK(privateKey: Hex, opts = { network: SupportedNetworks.MAINNET }) {
		return new LivelyDiamondSDK(opts.network, { privateKey });
	}

	// Getters
	public getNetwork() {
		return this._network;
	}

	// Read only properties
	public getAccount() {
		return this._account;
	}

	// Write properties (needs a signer)
	@CheckProperties(['_network'])
	public connectPK(privateKey: Hex) {
		this._account = privateKeyToAccount(privateKey);
		return this;
	}
}
