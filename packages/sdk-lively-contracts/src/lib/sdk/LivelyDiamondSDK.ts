import type { PrivateKeyAccount } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { isValidNetwork, isValidPrivateKey } from './shared/decorators.js';
import {
	SupportedNetworks,
	type LivelyDiamondSDKOptions,
	type EthAddress
} from './shared/types.js';
import EventEmitter from 'eventemitter3';

/**
 * LivelyDiamond SDK
 */

const defaultOpts = {
	network: SupportedNetworks.MAINNET,
	privateKey: undefined
};

type EventTypes = {
	foo: () => void;
	bar: (error: Error) => void;
};

// class LivelyDiamondSDK extends EventEmitter {
export default class<T extends object> extends EventEmitter<EventTypes & T> {
	network: SupportedNetworks | undefined;
	private account: PrivateKeyAccount | undefined;

	constructor(opts: LivelyDiamondSDKOptions = defaultOpts) {
		if (opts.network && !isValidNetwork(opts.network)) throw new Error('Invalid network');
		if (opts.privateKey && !isValidPrivateKey(opts.privateKey)) throw new Error('Invalid PK');

		super();
		this.network = opts.network;
		this.account = opts?.privateKey ? privateKeyToAccount(opts.privateKey) : undefined;
	}

	static fromPK(privateKey: EthAddress, opts = { network: SupportedNetworks.MAINNET }) {
		if (!isValidPrivateKey(privateKey)) throw new Error('Invalid PK');
		if (opts.network && !isValidNetwork(opts.network)) throw new Error('Invalid network');

		return new this({ network: opts.network, privateKey });
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

// export default LivelyDiamondSDK;/s
