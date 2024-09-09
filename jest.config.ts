import type {Config} from 'jest';

const config: Config = {
  'roots': [
		'<rootDir>/src'
	],
	'testMatch': [
		'**/Tests/test.*.+(ts|tsx|js)',
	],
	'transform': {
		'^.+\\.(ts|tsx)$': 'tsx'
	},
	moduleNameMapper: {
		'^axios$': require.resolve('axios'),
	},
};

export default config;