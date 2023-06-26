import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
		alias: {
			$lib: 'src/lib'
		}
	},

	// for more information about preprocessors
	preprocess: vitePreprocess()
};

export default config;
