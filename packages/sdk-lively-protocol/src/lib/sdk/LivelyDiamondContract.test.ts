import { generatePrivateKey } from 'viem/accounts';
import { beforeEach, describe, expect, it } from 'vitest';

import { LivelyDiamondContract } from './LivelyDiamondContract.js';

describe('livelyDiamondContract', () => {
	let livelyDiamondContract: LivelyDiamondContract;

	const validPK = generatePrivateKey();
	// These mnemonics are set explicitly because of hardhats .env file
	// FIXME: This should be changed to be dynamic, need to make that work with hardhat package as well so I know what accounts are available
	const testMnemonic =
		'south crazy loan indoor cause option evil settle feed recipe mushroom false';

	describe('constructor', () => {
		beforeEach(() => {
			livelyDiamondContract = new LivelyDiamondContract();
		});

		it('should have properties', () => {
			expect(livelyDiamondContract).toHaveProperty('_address');
		});
	});
});
