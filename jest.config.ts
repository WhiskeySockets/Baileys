/** @jest-config-loader esbuild-register */
import type { Config } from 'jest'

const config: Config = {
	roots: ['<rootDir>/src'],
	testMatch: ['**/Tests/test.*.+(ts|tsx|js)'],
	extensionsToTreatAsEsm: ['.ts'],
	transform: {
		'^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true }]
	},
	moduleNameMapper: {
		'^axios$': String(require.resolve('axios'))
	}
}

export default config
