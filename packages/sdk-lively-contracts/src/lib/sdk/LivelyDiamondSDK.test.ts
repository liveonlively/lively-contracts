import { it, describe, expect, beforeEach } from 'vitest';
import { generatePrivateKey } from 'viem/accounts';
import LivelyDiamondSDK from './LivelyDiamondSDK.js';
import { isValidNetwork, isValidPrivateKey } from './shared/decorators.js';
import { SupportedNetworks } from './shared/types.js';
// import { avalanche } from 'viem/chains';

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
			sdk = new LivelyDiamondSDK({ network: SupportedNetworks.MAINNET });
		});

		it('should create a new instance of the livelyDiamondSDK', () => {
			expect(sdk).to.be.instanceOf(LivelyDiamondSDK);
			expect(sdk.network).not.toBe('matic');
			expect(sdk.network).toBe('mainnet');
			expect(sdk.getAccount()).toBeUndefined();
		});

		it('should create a new instance of the livelyDiamondSDK with a default network (mainnet)', () => {
			console.log('sdk', sdk);
			const livelyDiamondSDKDefault = new LivelyDiamondSDK();
			console.log('after creation');

			expect(livelyDiamondSDKDefault).to.be.instanceOf(LivelyDiamondSDK);
			expect(livelyDiamondSDKDefault.network).not.toBe('mumbai');
			expect(livelyDiamondSDKDefault.network).toBe('mainnet');
		});

		it('should have the correct properties', () => {
			expect(sdk).toHaveProperty('network');
			expect(sdk).toHaveProperty('account');
			expect(sdk).not.toHaveProperty('privateKey');
		});

		it('should throw an error if an invalid network is passed', () => {
			// @ts-expect-error This is testing an invalid network so it should throw an error
			expect(() => new LivelyDiamondSDK({ network: 'mainnet2' })).toThrow();
		});
	});

	describe('privateKeys', () => {
		beforeEach(() => {
			sdk = new LivelyDiamondSDK({ network: SupportedNetworks.MUMBAI });
		});

		it('return account info if properly given private key', () => {
			const sdk2 = LivelyDiamondSDK.fromPK(validPK);
			console.log({ sdk2 });
		});
	});
});
