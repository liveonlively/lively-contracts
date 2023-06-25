import type { Client, Hex, PublicClient, WalletClient } from 'viem';

export class LivelyDiamondContract {
	protected address: Hex | undefined;

	constructor(address: Hex) {
		this.address = address;
	}
}
