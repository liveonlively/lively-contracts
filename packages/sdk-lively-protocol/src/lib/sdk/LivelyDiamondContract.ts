import type { Hex } from 'viem';

import type { SupportedNetworksType } from './shared/types.js';

export class LivelyDiamondContract {
	private _address: undefined | Hex;
	protected _network: SupportedNetworksType | undefined;

	constructor(address?: Hex) {
		this._address = address;

		return this;
	}

	public deployContract() {
		console.log('Deploying contract');
		return 5;
	}

	// Getters/setters for protected properties that need to be read/written by decorator methods
	get network(): typeof this._network {
		return this._network;
	}

	protected getLivelyDiamondContract() {
		return this;
	}
}
