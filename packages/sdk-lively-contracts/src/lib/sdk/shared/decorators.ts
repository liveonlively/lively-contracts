import { privateKeyToAccount } from 'viem/accounts';
import { SupportedNetworks, type EthAddress } from './types.js';

// NOTE: Need to get these working as actual decorators. Mainly having trouble with the constructor decorator for the class.

export function isValidNetwork(network: SupportedNetworks): boolean {
	if (!Object.values(SupportedNetworks).includes(network)) return false;
	return true;
}

export function isValidPrivateKey(privateKey: EthAddress): boolean {
	try {
		privateKeyToAccount(privateKey);
		return true;
	} catch (error) {
		return false;
	}
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function SDKValidator<T extends { new (...args: any[]): {} }>(constructor: T) {
	return class extends constructor {
		constructor(...args: any[]) {
			const keys = args[0] ? Object.keys(args[0]) : [];

			if (keys.includes('network') && !isValidNetwork(args[0].network)) {
				throw new Error('Invalid network');
			}

			if (keys.includes('privateKey') && !isValidPrivateKey(args[0].privateKey)) {
				throw new Error('Invalid PK');
			}

			super(...args);
		}
	};
}
