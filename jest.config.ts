/** @jest-config-loader esbuild-register */
import type { Config } from 'jest'

const config: Config = {
	roots: ['<rootDir>/src'],
	testMatch: ['**.test.ts'],
	extensionsToTreatAsEsm: ['.ts'],
	transform: {
		'^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true }]
	},
}

export default config