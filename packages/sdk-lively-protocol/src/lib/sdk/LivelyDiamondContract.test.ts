import { it, describe, expect, beforeEach } from 'vitest';
import { generatePrivateKey } from 'viem/accounts';
import {
	type Address,
	createWalletClient,
	http,
	createPublicClient,
	type WalletClient
} from 'viem';
import { LivelyDiamondSDK } from './LivelyDiamondSDK.js';
import { isValidNetwork, isValidPrivateKey } from './shared/decorators.js';
import { SupportedNetworks } from './shared/types.js';
import { mainnet } from 'viem/chains';
import { LivelyDiamondContract } from './LivelyDiamondContract.js';

describe('livelyDiamondContract', () => {
	const validPK = generatePrivateKey();
	// These mnemonics are set explicitly because of hardhats .env file
	// FIXME: This should be changed to be dynamic, need to make that work with hardhat package as well so I know what accounts are available
	const testMnemonic =
		'south crazy loan indoor cause option evil settle feed recipe mushroom false';
	const testPublicAddress = '0x0b3Ca3586327FAB688fd34feF784d586e3828153';
	const protectedProps = ['network', 'account'] as const;

	let sdk: LivelyDiamondSDK;

	describe('decorators', () => {
		beforeEach(() => {
			sdk = new LivelyDiamondSDK();
		});

		it('have a contract object', () => {
			expect(sdk.contract).toBeInstanceOf(LivelyDiamondContract);
		});

		it('should have correct properties on contract', () => {
			expect(sdk.contract).toHaveProperty('_network');
			expect(sdk.contract).toHaveProperty('_address');
		});
	});
});
