/* eslint-disable @typescript-eslint/no-explicit-any */
import { privateKeyToAccount } from 'viem/accounts';
import { SupportedNetworks } from './types.js';
import type { Hex } from 'viem';

/**
 * Checks that the properties passed are defined
 * @param properties A list of properties to check
 * @returns
 */
export function CheckProperties(properties: string[]) {
	return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
		const originalMethod = descriptor.value;

		descriptor.value = function (...args: any[]) {
			for (const property of properties) {
				if ((this as any)[property] == undefined) {
					throw new Error(`${property} is not defined`);
				}
			}
			return originalMethod.apply(this, args);
		};

		return descriptor;
	};
}

export function isValidNetwork(network: keyof typeof SupportedNetworks): boolean {
	return Object.keys(SupportedNetworks).includes(network) ? false : true;
}

export function isValidPrivateKey(privateKey: Hex): boolean {
	try {
		privateKeyToAccount(privateKey);
		return true;
	} catch (err) {
		return false;
	}
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function SDKValidator<T extends { new (...args: any[]): {} }>(constructor: T) {
	return class extends constructor {
		constructor(...args: any[]) {
			if (args[0]?.network && !isValidNetwork(args[0])) {
				throw new Error('Invalid network');
			}

			if (args[0]?.privateKey && !isValidPrivateKey(args[0]?.privateKey)) {
				throw new Error('Invalid PK');
			}

			super(...args);
		}
	};
}
