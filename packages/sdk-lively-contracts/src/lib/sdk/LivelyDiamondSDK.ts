import type { PrivateKeyAccount } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { isValidNetwork, isValidPrivateKey, validate } from './shared/decorators.js';
import {
	SupportedNetworks,
	type LivelyDiamondSDKOptions,
	type EthAddress
} from './shared/types.js';
// import EventEmitter from 'eventemitter3';

/**
 * LivelyDiamond SDK
 */

const defaultOpts = {
	network: SupportedNetworks.MAINNET,
	privateKey: undefined
};

// type EventTypes = {
// 	foo: () => void;
// 	bar: (error: Error) => void;
// };

// class LivelyDiamondSDK<T extends object> extends EventEmitter<EventTypes & T> {

@validate('network', isValidNetwork, { optional: true })
@validate('privateKey', isValidPrivateKey, { optional: true })
class LivelyDiamondSDK {
	network: SupportedNetworks | undefined;
	private account: PrivateKeyAccount | undefined;

	constructor(opts: LivelyDiamondSDKOptions = defaultOpts) {
		this.network = opts?.network || SupportedNetworks.MAINNET;
		this.account = opts?.privateKey ? privateKeyToAccount(opts.privateKey) : undefined;
	}

	// Read only properties
	public getAccount() {
		return this.account;
	}

	// Write properties (needs a signer)
	@validate('privateKey', isValidPrivateKey)
	public connectPK(opts: { privateKey: EthAddress }) {
		this.account = privateKeyToAccount(opts.privateKey);
	}
}

export default LivelyDiamondSDK;
