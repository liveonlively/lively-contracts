import type { PrivateKeyAccount, Hex, PublicClient, WalletClient, Client, HDAccount } from 'viem';
import { mnemonicToAccount, privateKeyToAccount } from 'viem/accounts';
import { SDKValidator, CheckPropsDefined, ConnectClient } from './shared/decorators.js';
import {
	type SupportedNetworksType,
	SupportedNetworks,
	type LivelyDiamondSDKOptions
} from './shared/types.js';
import 'reflect-metadata';
import { LivelyDiamondContract } from './LivelyDiamondContract.js';

/**
 * LivelyDiamond SDK
 */

const defaultOpts: LivelyDiamondSDKOptions = {
	privateKey: undefined,
	mnemonic: undefined,
	contractAddress: undefined
};

@SDKValidator
export class LivelyDiamondSDK extends LivelyDiamondContract {
	// protected _network: SupportedNetworksType | undefined;
	protected _account: PrivateKeyAccount | HDAccount | undefined;
	protected _publicClient: PublicClient | undefined;
	protected _walletClient: WalletClient | undefined;
	protected _contract: LivelyDiamondContract;
	protected _client: Client | undefined;
	public walletConnected = () => !!this._walletClient;

	// Constructor + Static Builers
	constructor(network: SupportedNetworksType = SupportedNetworks.MAINNET, opts = defaultOpts) {
		super(opts.contractAddress);

		this._contract = this.getLivelyDiamondContract();
		this._network = network;

		if (opts.privateKey) {
			this._account = privateKeyToAccount(opts.privateKey);
		} else if (opts.mnemonic) {
			this._account = mnemonicToAccount(opts.mnemonic);
		}

		this.connectClient();
	}

	static fromPK(privateKey: Hex, opts = { network: SupportedNetworks.MAINNET }): LivelyDiamondSDK {
		return new LivelyDiamondSDK(opts.network, { privateKey });
	}

	static fromMnemonic(
		mnemonic: string,
		opts = { network: SupportedNetworks.MAINNET }
	): LivelyDiamondSDK {
		return new LivelyDiamondSDK(opts.network, { mnemonic });
	}

	/**
	 * Creates a walletClient or a publicClient depending on the account
	 */
	@ConnectClient()
	private connectClient() {
		// Let decorator do the work
		// FIXME: This feels wrong
	}

	// // Getters/setters for protected properties that need to be read/written by decorator methods
	// get network(): typeof this._network {
	// 	return this._network;
	// }

	get account(): typeof this._account {
		return this._account;
	}

	get publicClient(): typeof this._publicClient {
		return this._publicClient;
	}

	set publicClient(value: PublicClient | undefined) {
		if (value && value?.type !== 'publicClient') throw new Error('Incorrect type for publicClient');
		this._publicClient = value;
	}

	get contract(): typeof this._contract {
		return this._contract;
	}

	get client(): typeof this._client {
		return this._client;
	}

	set client(value: Client | undefined) {
		this._client = value;
	}

	get walletClient(): typeof this._walletClient {
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

	@CheckPropsDefined(['_network'])
	@ConnectClient()
	public connectFromMnemonic(mnemonic: string) {
		this._account = mnemonicToAccount(mnemonic);
		return this;
	}

	@ConnectClient()
	public setNetwork(network: SupportedNetworksType) {
		this._network = network;

		return this;
	}
}
