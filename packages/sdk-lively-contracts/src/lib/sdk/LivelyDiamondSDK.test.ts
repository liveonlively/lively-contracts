import { it, describe, expect, beforeEach } from 'vitest';
import { generatePrivateKey } from 'viem/accounts';
import type { Address } from 'viem';
import { LivelyDiamondSDK } from './LivelyDiamondSDK.js';
import { isValidNetwork, isValidPrivateKey } from './shared/decorators.js';
import { SupportedNetworks } from './shared/types.js';

describe('livelyDiamondSDK', () => {
	const validPK = generatePrivateKey();
	let sdk: LivelyDiamondSDK;

	describe('decorators', () => {
		describe('isValidNetwork', () => {
			it('should be false for invalid network', () => {
				// @ts-expect-error This is testing an invalid network so it should throw an error
				expect(() => isValidNetwork('mainnet2')).toBeFalsy;
			});

			it('should not throw an error if a valid network is passed', () => {
				expect(() => isValidNetwork(SupportedNetworks.MAINNET)).toBeTruthy;
			});
		});

		describe('isValidPrivateKey', () => {
			it('should return false if an invalid private key is passed', () => {
				expect(() => isValidPrivateKey('0x1234')).toBeFalsy;
			});

			it('should return true if a valid private key is passed', () => {
				expect(() => isValidPrivateKey(validPK)).toBeTruthy;
			});
		});
	});

	describe('constructor', () => {
		beforeEach(() => {
			sdk = new LivelyDiamondSDK(SupportedNetworks.MAINNET);
		});

		// FAILING TEST
		it('should create a new instance of the livelyDiamondSDK', () => {
			expect(sdk).to.be.instanceOf(LivelyDiamondSDK);
			expect(sdk.getNetwork()).not.toBe('matic');
			expect(sdk.getNetwork()).toBe('mainnet');
			expect(sdk.getAccount()).toBeUndefined();
		});

		it('should create a new instance of the livelyDiamondSDK with a default network (mainnet)', () => {
			const livelyDiamondSDKDefault = new LivelyDiamondSDK();

			expect(livelyDiamondSDKDefault).to.be.instanceOf(LivelyDiamondSDK);
			expect(livelyDiamondSDKDefault.getNetwork()).not.toBe('mumbai');
			expect(livelyDiamondSDKDefault.getNetwork()).toBe('mainnet');
		});

		it('should have the correct properties', () => {
			expect(sdk).toHaveProperty('_network');
			expect(sdk).toHaveProperty('_account');
		});
		it('should throw an error if an invalid network is passed', () => {
			// @ts-expect-error This is testing an invalid network so it should throw an error
			expect(() => new LivelyDiamondSDK({ network: 'mainnet2' })).toThrow();
		});
	});

	describe('privateKeys', () => {
		beforeEach(() => {
			sdk = new LivelyDiamondSDK(SupportedNetworks.MUMBAI);
		});

		it('return account info if properly given private key', () => {
			expect(() => LivelyDiamondSDK.fromPK(validPK)).not.toThrow();
		});

		it('throw error if improper key given', () => {
			expect(() => LivelyDiamondSDK.fromPK('0x1234')).toThrow();
		});

		it('should allow a user to switch accounts of the SDK', () => {
			const privateKeys = [generatePrivateKey(), generatePrivateKey()];
			const publicAddresses: (Address | undefined)[] = [];

			expect(sdk.getAccount()).toBeUndefined();
			expect(() => sdk.connectPK(privateKeys[0])).not.toThrow();
			publicAddresses.push(sdk.getAccount()?.address);

			expect(() => sdk.connectPK(privateKeys[1])).not.toThrow();
			publicAddresses.push(sdk.getAccount()?.address);

			expect(publicAddresses[0]).not.toEqual(publicAddresses[1]);
		});

		it('should allow a user to connectPK chained to mainnet default creation', () => {
			// @ts-expect-error This is testing an invalid network so it should throw an error, should never happen
			sdk._network = undefined; // This should never be able to happen but just in case
			expect(() => sdk.connectPK(validPK)).toThrow();
		});

		it('should allow a user to switch accounts of the SDK', () => {
			sdk.connectPK(validPK);
			const account1 = sdk.getAccount();
			expect(sdk.getAccount()).toBeDefined();

			const validPK2 = generatePrivateKey();
			sdk.connectPK(validPK2);

			const account2 = sdk.getAccount();
			expect(sdk.getAccount()).toBeDefined();

			expect(account1).to.not.equal(account2);
		});
	});
});
