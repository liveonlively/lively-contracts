import type { PrivateKeyAccount, Hex, PublicClient, WalletClient, Client } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { SDKValidator, CheckPropsDefined, ConnectClient } from './shared/decorators.js';
import {
	type SupportedNetworksType,
	SupportedNetworks,
	type LivelyDiamondSDKOptions
} from './shared/types.js';
import 'reflect-metadata';

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
	protected _client: Client | undefined;
	public walletConnected = () => !!this._walletClient;

	// Constructor + Static Builers
	constructor(network: SupportedNetworksType = SupportedNetworks.MAINNET, opts = defaultOpts) {
		this._network = network;
		this._account = opts.privateKey ? privateKeyToAccount(opts.privateKey) : undefined;

		this.connectClient();
	}

	static fromPK(privateKey: Hex, opts = { network: SupportedNetworks.MAINNET }): LivelyDiamondSDK {
		return new LivelyDiamondSDK(opts.network, { privateKey });
	}

	/**
	 * Creates a walletClient or a publicClient depending on the account
	 */
	@ConnectClient()
	private connectClient() {
		// Let decorator do the work
	}

	// Getters/setters for protected properties that need to be read/written by decorator methods
	get network(): SupportedNetworksType | undefined {
		return this._network;
	}

	get account(): PrivateKeyAccount | undefined {
		return this._account;
	}

	get publicClient(): PublicClient | undefined {
		return this._publicClient;
	}

	set publicClient(value: PublicClient | undefined) {
		if (value && value?.type !== 'publicClient') throw new Error('Incorrect type for publicClient');
		this._publicClient = value;
	}

	get client(): Client | undefined {
		return this._client;
	}

	set client(value: Client | undefined) {
		this._client = value;
	}

	get walletClient(): WalletClient | undefined {
		return this._walletClient;
	}

	set walletClient(value: WalletClient | undefined) {
		if (value && value?.type !== 'walletClient') throw new Error('Incorrect type for walletClient');
		this._walletClient = value;
	}

	@CheckPropsDefined(['_network'])
	@ConnectClient()
	public connectPK(privateKey: Hex) {
		this._account = privateKeyToAccount(privateKey);
		return this;
	}

	@ConnectClient()
	public setNetwork(network: SupportedNetworksType) {
		this._network = network;

		return this;
	}
}
