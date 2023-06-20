import { it, describe, expect, beforeEach } from 'vitest';
import LivelyDiamondFactory, { SupportedNetworks } from './LivelyDiamondFactory.js';

describe('LivelyDiamondFactory', () => {
	// Descrube a test for library diamond factory
	describe('constructor', () => {
		it('should create a new instance of the LivelyDiamondFactory', () => {
			const livelyDiamondFactory = new LivelyDiamondFactory(SupportedNetworks.MAINNET); // Move to before each

			expect(livelyDiamondFactory).toBeDefined();
			expect(livelyDiamondFactory).to.be.instanceOf(LivelyDiamondFactory);
			expect(livelyDiamondFactory.network).not.toBe('matic');
			expect(livelyDiamondFactory.network).toBe('mainnet');
		}); // end it

		it('should create a new instance of the LivelyDiamondFactory with a network', () => {
			// Do Something
		});
	}); // end describe
});

// import { secondsToTimecode, formatDateTimeString, timecodeToSeconds } from './time';
/**
describe('secondsToTimecode', () => {
	it('converts zero seconds to a zero timecode', () => {
		expect(secondsToTimecode(0)).toBe('00:00:00.0');
	});
	it('converts seconds to timecode and rounds to the nearest 10th of a second', () => {
		expect(secondsToTimecode(3728.666667)).toBe('01:02:08.7');
	});
});

describe('timecodeToSeconds', () => {
	it('converts zero timecode to zero seconds', () => {
		expect(timecodeToSeconds('00:00:00.0')).toBe(0);
	});
	it('converts timecode to seconds that were rounded to the nearest 10th of a second', () => {
		expect(timecodeToSeconds('01:02:08.7')).toBe(3728.7);
	});
	it('handles missing parts of the timecode when converting to zero seconds', () => {
		expect(timecodeToSeconds('8:11')).toBe(491);
	});
});

describe('formatDateTime', () => {
	it('converts event time from the database to different timezones', () => {
		expect(
			formatDateTimeString('2021-12-15T02:00:00.000', { zone: 'America/Los_Angeles' }).replace(
				/\u202f/g,
				' '
			)
		).toBe('Tuesday, 12/14/21, 6:00 PM PST');
		expect(
			formatDateTimeString('2021-10-15T02:00:00.000', { zone: 'America/Los_Angeles' }).replace(
				/\u202f/g,
				' '
			)
		).toBe('Thursday, 10/14/21, 7:00 PM PDT');
	});
	it('converts time slot times from the database to different timezones', () => {
		expect(
			formatDateTimeString('2021-12-15T02:00+00:00', { zone: 'America/Los_Angeles' }).replace(
				/\u202f/g,
				' '
			)
		).toBe('Tuesday, 12/14/21, 6:00 PM PST');
		expect(
			formatDateTimeString('2021-10-15T02:00+00:00', { zone: 'America/Los_Angeles' }).replace(
				/\u202f/g,
				' '
			)
		).toBe('Thursday, 10/14/21, 7:00 PM PDT');
	});
});
 */
