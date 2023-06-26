import {
	type Address,
	type WalletClient,
	createPublicClient,
	createWalletClient,
	http
} from 'viem';
import { generatePrivateKey } from 'viem/accounts';
import { mainnet } from 'viem/chains';
import { beforeEach, describe, expect, it } from 'vitest';

import { LivelyDiamondSDK } from './LivelyDiamondSDK.js';
import { isValidNetwork, isValidPrivateKey } from './shared/decorators.js';
import { SupportedNetworks } from './shared/types.js';
// import { mainnet } from 'viem/chains';

describe('livelyDiamondSDK', () => {
	const validPK = generatePrivateKey();
	// These mnemonics are set explicitly because of hardhats .env file
	// FIXME: This should be changed to be dynamic, need to make that work with hardhat package as well so I know what accounts are available
	const testMnemonic =
		'south crazy loan indoor cause option evil settle feed recipe mushroom false';
	const testPublicAddress = '0x0b3Ca3586327FAB688fd34feF784d586e3828153';
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

		it('should create a new instance of the livelyDiamondSDK', async () => {
			expect(sdk).to.be.instanceOf(LivelyDiamondSDK);
			expect(sdk.network).not.toBe(SupportedNetworks.MUMBAI);
			expect(sdk.network).toBe(SupportedNetworks.MAINNET);
			expect(sdk.walletConnected()).toBe(true);
			expect(sdk.walletClient?.account).toBeUndefined();
			expect(sdk.account).toBeUndefined();
		});

		it('should create a new instance of the livelyDiamondSDK with a default network (homestead)', () => {
			const livelyDiamondSDKDefault = new LivelyDiamondSDK();

			expect(livelyDiamondSDKDefault).to.be.instanceOf(LivelyDiamondSDK);
			expect(livelyDiamondSDKDefault.network).not.toBe(SupportedNetworks.MUMBAI);
			expect(livelyDiamondSDKDefault.network).toBe(SupportedNetworks.MAINNET);
		});

		it('should create a new instance of the livelyDiamondSDK with polygon as the network', () => {
			const livelyDiamondSDKDefault = new LivelyDiamondSDK(SupportedNetworks.POLYGON);

			expect(livelyDiamondSDKDefault).to.be.instanceOf(LivelyDiamondSDK);
			expect(livelyDiamondSDKDefault.network).not.toBe(SupportedNetworks.MAINNET);
			expect(livelyDiamondSDKDefault.network).toBe(SupportedNetworks.POLYGON);
		});

		it('should have the correct methods', () => {
			// @ts-expect-error This is testing that following properties only have getters and not setters
			expect(() => (sdk.network = SupportedNetworks.MUMBAI)).toThrow();
		});

		it('should throw an error if an invalid network is passed', () => {
			// @ts-expect-error This is testing an invalid network so it should throw an error
			expect(() => new LivelyDiamondSDK('mainnet2')).toThrow('Invalid network');
		});
	});

	describe('protected properties', () => {
		beforeEach(() => {
			sdk = new LivelyDiamondSDK();
		});

		it('should have the correct getters for protected properties', () => {
			for (const property of protectedProps) {
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
			// FIXME: Change this to something else now that I know we need both a publicClient and walletClient (local or RPC)
		});
	});

	describe('privateKeys', () => {
		beforeEach(() => {
			sdk = new LivelyDiamondSDK(SupportedNetworks.MUMBAI);
		});

		it('return account info if properly given private key', () => {
			expect(() => LivelyDiamondSDK.fromPK(validPK)).not.toThrow();
		});

		it('walletConnected() should return true after PK is attached', () => {
			sdk.connectPK(validPK);
			expect(sdk.walletConnected()).toBe(true);
		});

		it('throw error if improper key given', () => {
			expect(() => LivelyDiamondSDK.fromPK('0x1234')).toThrow('Invalid PK');
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
			expect(() => sdk.connectPK(validPK)).toThrow('_network is not defined');
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

	describe('mnemonic', () => {
		it('should create a client by a valid mnemonic', () => {
			const sdk = LivelyDiamondSDK.fromMnemonic(testMnemonic);

			expect(sdk.account?.address).to.equal(testPublicAddress);
			expect(sdk.publicClient).toBeDefined();
			expect(sdk.walletClient).toBeDefined();
		});
	});

	describe('HardHat test network', () => {
		it('should connect to network', () => {
			// TODO: Fix this test after working contract class, maybe move ot Contract.test.ts
		});
	});
});
