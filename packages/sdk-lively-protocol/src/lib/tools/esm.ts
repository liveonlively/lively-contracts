import { DEV } from 'esm-env';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logger = (...args: any) => {
	const TEST = process.env.NODE_ENV === 'test';

	if (DEV || TEST) console.log(...args);
};
