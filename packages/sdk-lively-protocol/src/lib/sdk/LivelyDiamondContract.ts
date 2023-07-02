import type { Diamond1155Init } from '@liveonlively/lively-contracts/types';
import type { Hex } from 'viem';

import { abi, bytecode } from '@liveonlively/lively-contracts/abi-bytecode/Lively1155Diamond.js';
import { parseEther } from 'viem';

import type { LivelyDiamondContractOptions } from './shared/types.js';

import { LivelyDiamondSDK } from './LivelyDiamondSDK.js';
export class LivelyDiamondContract extends LivelyDiamondSDK {
	private _address: Hex | undefined;

	constructor(opts: LivelyDiamondContractOptions = {}) {
		super(opts?.network, opts);

		this._address = opts?.address;

		return this;
	}

	get address(): Hex | undefined {
		return this._address;
	}

	public deployContract() {
		if (!this._walletClient.account) throw new Error('No account set');
		console.log('Deploying contract');
		return 5;
	}

	protected getLivelyDiamondContract() {
		return this;
	}
}

export const defaultArgs: Diamond1155Init.DiamondArgsStruct = {
	_airdrop: false,
	_automaticUSDConversion: false,
	// _tokenData: [],
	_baseURI: 'https://golive.ly/web3/meta/something/',
	_contractURI: 'https://golive.ly/meta/something',
	_isPriceUSD: false,
	_name: 'Foo',
	_payees: [
		'0x208731e5331799D88B8B39E1A1182e90b05d94BA',
		'0x82b57d0b483fFE807E3947F2F8Ceb7896a16d79D',
	], // Primary
	_secondaryPayee: '0x208731e5331799D88B8B39E1A1182e90b05d94BA', // Secondary
	_secondaryShare: 500, // 5% // Secondary
	_shares: [50, 50], // 100% // Primary
	_symbol: 'BAR',
	_tokenData: [
		{
			allowListEnabled: false,
			creator: '0x208731e5331799D88B8B39E1A1182e90b05d94BA',
			isCrossmintUSDC: false,
			maxSupply: 50,
			price: parseEther('0.0001'),
			startTime: 0,
			tokenUri: '',
		},
		{
			allowListEnabled: false,
			creator: '0x208731e5331799D88B8B39E1A1182e90b05d94BA',
			isCrossmintUSDC: false,
			maxSupply: 100,
			price: parseEther('0.00001'),
			startTime: 0,
			tokenUri: '',
		},
		{
			allowListEnabled: false,
			creator: '0x208731e5331799D88B8B39E1A1182e90b05d94BA',
			isCrossmintUSDC: false,
			maxSupply: 100000,
			price: parseEther('0.00001'),
			startTime: 0,
			tokenUri: '',
		},
	],
};
