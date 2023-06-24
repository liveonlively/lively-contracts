import type { PrivateKeyAccount, Hex, PublicClient, WalletClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { SDKValidator, CheckProperties } from './shared/decorators.js';
import {
	type SupportedNetworksType,
	SupportedNetworks,
	type LivelyDiamondSDKOptions
} from './shared/types.js';
import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { BROWSER } from 'esm-env';
/**
 * LivelyDiamond SDK
 */

const defaultOpts: LivelyDiamondSDKOptions = {
	privateKey: undefined
};

@SDKValidator
export class LivelyDiamondSDK {
	protected _network: SupportedNetworksType | undefined;
	protected _account: PrivateKeyAccount | undefined;
	protected _publicClient: PublicClient | undefined;
	protected _walletClient: WalletClient | undefined;

	// Constructor + Static Builers
	constructor(network: SupportedNetworksType = SupportedNetworks.MAINNET, opts = defaultOpts) {
		this._network = network;
		this._account = opts.privateKey ? privateKeyToAccount(opts.privateKey) : undefined;

		if (this._account) {
			const transport = BROWSER && window.ethereum ? custom(window.ethereum) : http();

			this._walletClient = createWalletClient({
				account: this._account,
				chain: this._network,
				transport
			});
		} else {
			this._publicClient = createPublicClient({ chain: this._network, transport: http() });
		}
	}

	static fromPK(privateKey: Hex, opts = { network: SupportedNetworks.MAINNET }): LivelyDiamondSDK {
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

	// PK Stuff
	@CheckProperties(['_network'])
	public connectPK(privateKey: Hex) {
		this._account = privateKeyToAccount(privateKey);
		return this;
	}

	// Write properties (needs a signer)
	public setNetwork(network: SupportedNetworksType) {
		this._network = network;
		return this;
	}
}
