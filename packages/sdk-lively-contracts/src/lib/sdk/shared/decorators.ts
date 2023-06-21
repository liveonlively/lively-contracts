/* eslint-disable @typescript-eslint/no-explicit-any */
import { privateKeyToAccount } from 'viem/accounts';
import { SupportedNetworks } from './types.js';

export function isValidNetwork(network?: unknown): boolean {
	return Boolean(typeof network === 'string' && Object.values(SupportedNetworks).includes(network));
}

export function isValidPrivateKey(privateKey?: unknown): boolean {
	if (typeof privateKey !== 'string' || !privateKey.startsWith('0x')) return false;
	try {
		privateKeyToAccount(privateKey as `0x${string}`);
		return true;
	} catch (error) {
		// throw new Error(`Invalid private key: ${(error as Error).message}`);
		return false;
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validate<T extends abstract new (...args: any) => any>(
	field: string,
	validator: (v: unknown) => boolean,
	validateOptions: { optional?: boolean } = { optional: false }
) {
	return function (
		target: any,
		context: ClassDecoratorContext<T> | ClassMethodDecoratorContext<T>
	): T | void {
		if (!context || context.kind === 'class') {
			// Maybe do this instead of wrapping?
			// context.addInitializer(function () {
			// 	if (!validator(this[field as keyof T])) {
			// 		throw new Error(`Invalid ${String(field)}`);
			// 	}
			// });
			const wrapper = function (...args: any) {
				const opts = args?.[0];
				if ((validateOptions.optional && !opts?.[field]) || validator(opts?.[field])) {
					return new target(...args);
				}
				throw new Error(`Invalid ${String(field)}`);
			};
			wrapper.prototype = target.prototype;
			return wrapper as unknown as T;
		}
		if (context.kind === 'function') {
			const wrapper = function (...args: any) {
				const opts = args?.[0];
				if ((validateOptions.optional && !opts?.[field]) || validator(opts?.[field])) {
					return target(...args);
				}
				throw new Error(`Invalid ${String(field)}`);
			};
			wrapper.prototype = target.prototype;
			return wrapper as unknown as T;
		}
	};
}
