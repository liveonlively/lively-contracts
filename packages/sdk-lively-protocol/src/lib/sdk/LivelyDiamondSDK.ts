import {
	type Account,
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
	protected _network: SupportedNetworksType;
	protected _publicClient!: PublicClient;
	protected _walletClient!: WalletClient;
	public walletConnected = () => !!this._walletClient;

	// Constructor + Static Builders
	constructor(
		network: SupportedNetworksType = SupportedNetworks.MAINNET,
		opts = defaultConstructorOpts
	) {
		this._network = network;

		this.createClients(opts);
	}

	static fromMnemonic(mnemonic: string, opts = defaultWalletOpts): LivelyDiamondSDK {
		return new LivelyDiamondSDK(opts.network, { mnemonic });
	}

	static fromPK(privateKey: Hex, opts = defaultWalletOpts): LivelyDiamondSDK {
		return new LivelyDiamondSDK(opts.network, { privateKey });
	}

	static testCall() {
		// Test calling local ganache, then try hh node
		// [ ] Ganache
		// [ ] HH Node
		//
	}

	/** Client public and/or private client */
	private createClients(opts: LivelyDiamondSDKOptions): void {
		this.createPublicClient();
		this.createWalletClient(opts);
	}

	/** Creates a publicClient */
	private createPublicClient() {
		this._publicClient = createPublicClient({
			chain: this._network,
			transport: http(),
		});
	}

	/** Creates a walletClient */
	private createWalletClient(opts?: LivelyDiamondSDKOptions): void {
		let account: HDAccount | PrivateKeyAccount | undefined;
		if (opts?.privateKey) {
			account = privateKeyToAccount(opts.privateKey);
		} else if (opts?.mnemonic) {
			account = mnemonicToAccount(opts.mnemonic);
		}

		this._walletClient = createWalletClient({
			account,
			chain: this._network,
			transport: http(),
		});
	}

	get account(): Account | undefined {
		return this._walletClient.account;
	}

	@CheckPropsDefined(['_network'])
	public connectFromMnemonic(mnemonic: string) {
		const account = mnemonicToAccount(mnemonic);

		this._walletClient = createWalletClient({
			account,
			chain: this._network,
			transport: http(),
		});

		return this;
	}

	@CheckPropsDefined(['_network'])
	public connectPK(privateKey: Hex) {
		const account = privateKeyToAccount(privateKey);

		this._walletClient = createWalletClient({
			account,
			chain: this._network,
			transport: http(),
		});

		return this;
	}

	// // Getters/setters for protected properties that need to be read/written by decorator methods
	get network(): SupportedNetworksType {
		return this._network;
	}

	set publicClient(value: PublicClient) {
		if (value && value?.type !== 'publicClient') throw new Error('Incorrect type for publicClient');
		this._publicClient = value;
	}

	get publicClient(): PublicClient {
		return this._publicClient;
	}

	public setNetwork(network: SupportedNetworksType) {
		this._network = network;

		return this;
	}

	get walletClient(): WalletClient {
		return this._walletClient;
	}

	set walletClient(value: WalletClient) {
		if (value && value?.type !== 'walletClient') throw new Error('Incorrect type for walletClient');
		this._walletClient = value;
	}
}
