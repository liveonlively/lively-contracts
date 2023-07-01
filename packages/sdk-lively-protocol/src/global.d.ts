/// <reference types="@sveltejs/kit" />

declare interface Window {
	ethereum?: ExternalProvider;
}

declare type ExternalProvider = import('@ethersproject/providers').ExternalProvider;

interface EthereumProvider extends ExternalProvider {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	_state: any;
	sendAsync: AbstractProvider['sendAsync'];
}
