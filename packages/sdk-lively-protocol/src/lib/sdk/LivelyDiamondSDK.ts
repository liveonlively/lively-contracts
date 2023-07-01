import { type Writable, get, writable } from 'svelte/store';
import {
	type HDAccount,
	type Hex,
	type PrivateKeyAccount,
	type PublicClient,
	type WalletClient,
	createPublicClient,
	createWalletClient,
	http,
} from 'viem';
import { mnemonicToAccount, privateKeyToAccount } from 'viem/accounts';

import { CheckPropsDefined, SDKValidator } from './shared/decorators.js';
import {
	type LivelyDiamondSDKOptions,
	SupportedNetworks,
	type SupportedNetworksType,
} from './shared/types.js';

const defaultConstructorOpts: LivelyDiamondSDKOptions = {
	mnemonic: undefined,
	privateKey: undefined,
	// contractAddress: undefined
};

const defaultWalletOpts = { network: SupportedNetworks.MAINNET };

@SDKValidator
/**
 * LivelyDiamond SDK
 *
 * This SDK will make it easier for the user to connect to their LivelyDiamond contract, deploy a ERC721 and ERC1155 contract, mint tokens,
 * and interact with the contract in various ways.
 */
export class LivelyDiamondSDK {
	protected _account: HDAccount | PrivateKeyAccount | undefined;
	protected _network: SupportedNetworksType;
	protected _publicClient!: PublicClient;
	protected _walletClient!: Writable<WalletClient>;
	public walletConnected = () => !!this._walletClient;

	// Constructor + Static Builders
	constructor(
		network: SupportedNetworksType = SupportedNetworks.MAINNET,
		opts = defaultConstructorOpts
	) {
		// this._contract = this.getLivelyDiamondContract();
		this._network = network;

		if (opts.privateKey) {
			this._account = privateKeyToAccount(opts.privateKey);
		} else if (opts.mnemonic) {
			this._account = mnemonicToAccount(opts.mnemonic);
		}

		this.createClients();
	}

	static fromMnemonic(mnemonic: string, opts = defaultWalletOpts): LivelyDiamondSDK {
		return new LivelyDiamondSDK(opts.network, { mnemonic });
	}

	static fromPK(privateKey: Hex, opts = defaultWalletOpts): LivelyDiamondSDK {
		return new LivelyDiamondSDK(opts.network, { privateKey });
	}

	/** Client public and/or private client */
	private createClients(): void {
		this.createPublicClient();
		this.createWalletClient();
	}

	/** Creates a publicClient */
	private createPublicClient() {
		this._publicClient = createPublicClient({
			chain: this._network,
			transport: http(),
		});
	}

	/** Creates a walletClient */
	private createWalletClient(): void {
		this._walletClient = writable(
			createWalletClient({
				account: this._account,
				chain: this._network,
				transport: http(),
			})
		);
	}

	get account(): HDAccount | PrivateKeyAccount | undefined {
		return this._account;
	}

	@CheckPropsDefined(['_network'])
	public connectFromMnemonic(mnemonic: string) {
		this._account = mnemonicToAccount(mnemonic);
		return this;
	}

	@CheckPropsDefined(['_network'])
	public connectPK(privateKey: Hex) {
		this._account = privateKeyToAccount(privateKey);
		return this;
	}

	// // Getters/setters for protected properties that need to be read/written by decorator methods
	get network(): SupportedNetworksType | undefined {
		return this._network;
	}

	get publicClient(): PublicClient | undefined {
		return this._publicClient;
	}

	set publicClient(value: PublicClient) {
		if (value && value?.type !== 'publicClient') throw new Error('Incorrect type for publicClient');
		this._publicClient = value;
	}

	public setNetwork(network: SupportedNetworksType) {
		this._network = network;

		return this;
	}

	set walletClient(value: WalletClient) {
		if (value && value?.type !== 'walletClient') throw new Error('Incorrect type for walletClient');
		this._walletClient.set(value);
	}

	get walletClient(): WalletClient | undefined {
		if (!this._walletClient) return undefined;
		return get(this._walletClient);
	}
}
