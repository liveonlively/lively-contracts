import { it, describe, expect, beforeEach } from 'vitest';
import { generatePrivateKey } from 'viem/accounts';
import {
	type Address,
	createWalletClient,
	http,
	type WalletClient,
	createPublicClient
} from 'viem';
import { LivelyDiamondSDK } from './LivelyDiamondSDK.js';
import { isValidNetwork, isValidPrivateKey } from './shared/decorators.js';
import { SupportedNetworks } from './shared/types.js';
import { mainnet } from 'viem/chains';

describe('livelyDiamondSDK', () => {
	const validPK = generatePrivateKey();
	const protectedProps = ['network', 'account'] as const;

	let sdk: LivelyDiamondSDK;

	describe('decorators', () => {
		describe('isValidNetwork', () => {
			it('should be false for invalid network', () => {
				// @ts-expect-error This is testing runtime errors and should have a TS error
				expect(isValidNetwork('mainnet2')).toBe(false);
			});

			it('should not throw an error if a valid network is passed', () => {
				expect(isValidNetwork(SupportedNetworks.MAINNET)).toBe(true);
			});
		});

		describe('isValidPrivateKey', () => {
			it('should return false if an invalid private key is passed', () => {
				expect(isValidPrivateKey('0x1234')).toBe(false);
			});

			it('should return true if a valid private key is passed', () => {
				expect(isValidPrivateKey(validPK)).toBe(true);
			});
		});
	});

	describe('constructor', () => {
		beforeEach(() => {
			sdk = new LivelyDiamondSDK(SupportedNetworks.MAINNET);
		});

		it('should create a new instance of the livelyDiamondSDK', () => {
			expect(sdk).to.be.instanceOf(LivelyDiamondSDK);
			expect(sdk.network).not.toBe(SupportedNetworks.MUMBAI);
			expect(sdk.network).toBe(SupportedNetworks.MAINNET);
			expect(sdk.walletConnected()).toBe(false);
			expect(sdk.account).toBeUndefined();
		});

		it('should create a new instance of the livelyDiamondSDK with a default network (homestead)', () => {
			const livelyDiamondSDKDefault = new LivelyDiamondSDK();

			expect(livelyDiamondSDKDefault).to.be.instanceOf(LivelyDiamondSDK);
			expect(livelyDiamondSDKDefault.network).not.toBe(SupportedNetworks.MUMBAI);
			expect(livelyDiamondSDKDefault.network).toBe(SupportedNetworks.MAINNET);
		});

		it('should have the correct methods', () => {
			// @ts-expect-error This is testing that following properties only have getters and not setters
			expect(() => (sdk.network = SupportedNetworks.MUMBAI)).toThrow();
		});

		it('should throw an error if an invalid network is passed', () => {
			// @ts-expect-error This is testing an invalid network so it should throw an error
			expect(() => new LivelyDiamondSDK('mainnet2')).toThrow();
		});
	});

	describe('protected properties', () => {
		beforeEach(() => {
			sdk = new LivelyDiamondSDK();
		});

		it('should have the correct getters for proptected properties', () => {
			for (const property of protectedProps) {
				console.log({ property });
				expect(sdk).toHaveProperty(property);
			}
		});

		it('should not allow protected properties to be set', () => {
			for (const property of protectedProps) {
				// @ts-expect-error This is testing that following properties only have getters and not setters
				expect(() => (sdk[property] = 'foo')).toThrow();
			}
		});

		it('should not allow protected properties with setters to be assigned the wrong type', () => {
			const walletClient: WalletClient = createWalletClient({
				chain: mainnet,
				transport: http()
			});
			const publicClient = createPublicClient({ chain: mainnet, transport: http() });

			// @ts-expect-error This test should cause a TS error, but testing it's runtime behavior
			expect(() => (sdk.publicClient = walletClient)).toThrow();
			// @ts-expect-error This test should cause a TS error, but testing it's runtime behavior
			expect(() => (sdk.publicClient = 'bar')).toThrow();
			// @ts-expect-error This test should cause a TS error, but testing it's runtime behavior
			expect(() => (sdk.walletClient = publicClient)).toThrow();
			// @ts-expect-error This test should cause a TS error, but testing it's runtime behavior
			expect(() => (sdk.walletClient = 'bar')).toThrow();
		});
	});

	describe('networks', () => {
		beforeEach(() => {
			sdk = new LivelyDiamondSDK(SupportedNetworks.MUMBAI);
		});

		it('should automatically create appropriate client if PK is passed', () => {
			sdk = new LivelyDiamondSDK(SupportedNetworks.MUMBAI);
			sdk.connectPK(validPK);
			// expect(sdk.walletConnected()).toBe(true);
			console.log('sdk.publicClient: ', sdk.publicClient);
			console.log('sdk.walletClient: ', sdk.walletClient);
			console.log('sdk.client: ', sdk.client);
		});
	});

	describe('privateKeys', () => {
		beforeEach(() => {
			sdk = new LivelyDiamondSDK(SupportedNetworks.MUMBAI);
		});

		it('should allow the SDK to switch networks on the publicClient', () => {
			expect(sdk.walletConnected()).toBe(false);
			sdk.connectPK(validPK);
			expect(sdk.walletConnected()).toBe(true);
		});

		it('return account info if properly given private key', () => {
			expect(() => LivelyDiamondSDK.fromPK(validPK)).not.toThrow();
		});

		it('walletConnected() should return true after PK is attached', () => {
			sdk.connectPK(validPK);
			expect(sdk.walletConnected()).toBe(true);
		});

		it('throw error if improper key given', () => {
			expect(() => LivelyDiamondSDK.fromPK('0x1234')).toThrow();
		});

		it('should allow a user to switch accounts of the SDK1', () => {
			const privateKeys = [generatePrivateKey(), generatePrivateKey()];
			const publicAddresses: (Address | undefined)[] = [];

			expect(sdk.account).toBeUndefined();
			expect(() => sdk.connectPK(privateKeys[0])).not.toThrow();
			publicAddresses.push(sdk.account?.address);

			expect(() => sdk.connectPK(privateKeys[1])).not.toThrow();
			publicAddresses.push(sdk.account?.address);

			expect(publicAddresses[0]).not.toEqual(publicAddresses[1]);
		});

		it('should not allow a user to connect a PK if no network is selected', () => {
			// @ts-expect-error This is testing an invalid network so it should throw an error, should never happen
			sdk._network = undefined; // This should never be able to happen but just in case
			expect(() => sdk.connectPK(validPK)).toThrow();
		});

		it('should allow a user to switch accounts of the SDK2', () => {
			sdk.connectPK(validPK);
			const account1 = sdk.account;
			expect(sdk.account).toBeDefined();

			const validPK2 = generatePrivateKey();
			sdk.connectPK(validPK2);

			const account2 = sdk.account;
			expect(sdk.account).toBeDefined();

			expect(account1).to.not.equal(account2);
		});
	});
});
