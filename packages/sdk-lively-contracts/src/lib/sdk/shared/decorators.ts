import { privateKeyToAccount } from 'viem/accounts';
import { SupportedNetworks, type EthAddress, type LivelyDiamondSDKOptions } from './types.js';

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
		// throw new Error(`Invalid private key: ${(error as Error).message}`);
	}
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function Validate<T extends { new (...args: any[]): {} }>(constructor: T, ...args: any[]) {
	console.log({ constructor, args });
	return class extends constructor {
		isValidNetwork(network: SupportedNetworks): boolean {
			return isValidNetwork(network);
		}
	};
}

// /**
//  * Check if the options passed are valid
//  * @param opts All valid configuration options
//  * @returns void
//  * @throws Error if any of the options are invalid
//  */
// export function isValidOptions(opts?: Partial<LivelyDiamondSDKOptions>): boolean {
// 	console.log(`Inside isValidOptions: ${opts}`);

// 	if (!opts) return true;

// 	let isValid: boolean | undefined = undefined;

// 	if (opts?.privateKey) isValid ??= isValidPrivateKey(opts.privateKey);
// 	if (opts?.network) isValid ??= isValidNetwork(opts.network);

// 	if (!isValid) isValid ??= false;

// 	return isValid;
// }
