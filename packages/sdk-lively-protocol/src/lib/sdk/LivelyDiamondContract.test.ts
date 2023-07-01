import { beforeEach, describe, expect, it } from 'vitest';

import { LivelyDiamondContract } from './LivelyDiamondContract.js';

describe('livelyDiamondContract', () => {
	let livelyDiamondContract: LivelyDiamondContract;

	describe('constructor', () => {
		beforeEach(() => {
			livelyDiamondContract = new LivelyDiamondContract();
		});

		it('should have properties', () => {
			expect(livelyDiamondContract).toHaveProperty('_address');
		});
	});
});
