import {
	type PrivateKeyAccount,
	createWalletClient,
	createPublicClient,
	type WalletClient,
	type PublicClient,
	type HDAccount,
	type Hex,
	http
} from 'viem';
import { privateKeyToAccount, mnemonicToAccount } from 'viem/accounts';

import {
	type LivelyDiamondSDKOptions,
	type SupportedNetworksType,
	SupportedNetworks
} from './shared/types.js';
import { CheckPropsDefined, SDKValidator } from './shared/decorators.js';
import { LivelyDiamondContract } from './LivelyDiamondContract.js';

const defaultConstructorOpts: LivelyDiamondSDKOptions = {
	privateKey: undefined,
	mnemonic: undefined
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
export class LivelyDiamondSDK extends LivelyDiamondContract {
	protected _account: PrivateKeyAccount | HDAccount | undefined;
	protected _network: SupportedNetworksType | undefined;
	public walletConnected = () => !!this._walletClient;
	protected _walletClient: WalletClient | undefined;
	protected _publicClient: PublicClient | undefined;

	// Constructor + Static Builders
	constructor(
		network: SupportedNetworksType = SupportedNetworks.MAINNET,
		opts = defaultConstructorOpts
	) {
		super(opts.contractAddress);

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

	/** Creates a walletClient */
	private createWalletClient(): void {
		this._walletClient = createWalletClient({
			account: this._account,
			chain: this._network,
			transport: http()
		});
	}

	/** Creates a publicClient */
	private createPublicClient() {
		this._publicClient = createPublicClient({
			chain: this._network,
			transport: http()
		});
	}

	/** Client public and/or private client */
	private createClients(): void {
		this.createPublicClient();
		this.createWalletClient();
	}

	// // Getters/setters for protected properties that need to be read/written by decorator methods
	// get network(): typeof this._network {
	// 	return this._network;
	// }

	set walletClient(value: WalletClient | undefined) {
		if (value && value?.type !== 'walletClient') throw new Error('Incorrect type for walletClient');
		this._walletClient = value;
	}

	set publicClient(value: PublicClient | undefined) {
		if (value && value?.type !== 'publicClient') throw new Error('Incorrect type for publicClient');
		this._publicClient = value;
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

	public setNetwork(network: SupportedNetworksType) {
		this._network = network;

		return this;
	}

	// get contract(): typeof this._contract {
	// 	return this._contract;
	// }

	get publicClient(): typeof this._publicClient {
		return this._publicClient;
	}

	get walletClient(): typeof this._walletClient {
		return this._walletClient;
	}

	get account(): typeof this._account {
		return this._account;
	}
}
