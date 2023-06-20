import { it, describe, expect, beforeEach } from 'vitest';
import LivelyDiamondFactory, { SupportedNetworks } from './LivelyDiamondFactory.js';

describe('LivelyDiamondFactory', () => {
	let livelyDiamondFactory: LivelyDiamondFactory;

	describe('constructor', () => {
		beforeEach(() => {
			livelyDiamondFactory = new LivelyDiamondFactory(SupportedNetworks.MAINNET);
		});

		it('should create a new instance of the LivelyDiamondFactory', () => {
			expect(livelyDiamondFactory).to.be.instanceOf(LivelyDiamondFactory);
			expect(livelyDiamondFactory.network).not.toBe('matic');
			expect(livelyDiamondFactory.network).toBe('mainnet');
		});

		it('should create a new instance of the LivelyDiamondFactory with a default network (mainnet)', () => {
			const livelyDiamondFactoryDefault = new LivelyDiamondFactory();

			expect(livelyDiamondFactoryDefault).to.be.instanceOf(LivelyDiamondFactory);
			expect(livelyDiamondFactoryDefault.network).not.toBe('mumbai');
			expect(livelyDiamondFactoryDefault.network).toBe('mainnet');
		});

		it('should have the correct properties', () => {
			expect(livelyDiamondFactory).toHaveProperty('address');
			expect(livelyDiamondFactory).toHaveProperty('network');
			expect(livelyDiamondFactory).toHaveProperty('privateKey');
			expect(livelyDiamondFactory).not.toHaveProperty('privateKey2');
		});

		it('should throw an error if an invalid network is passed', () => {
			// @ts-expect-error This is testing an invalid network so it should throw an error
			expect(() => new LivelyDiamondFactory('mainnet2')).toThrow('Invalid network');
		});
	});
});
