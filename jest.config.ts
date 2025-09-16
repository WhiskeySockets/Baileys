/** @jest-config-loader esbuild-register */
import type { Config } from 'jest'

const config: Config = {
	preset: 'ts-jest/presets/default-esm',
	testEnvironment: 'node',
	roots: ['<rootDir>/src', '<rootDir>/WAProto'],
	testMatch: ['<rootDir>/src/**/*.test.ts'],
	extensionsToTreatAsEsm: ['.ts'],
	moduleNameMapper: {
		'^(\\.{1,2}/.*)\\.js$': '$1',
	},
	transform: {
		'^.+\\.tsx?$': [
			'ts-jest',
			{
				useESM: true,
				tsconfig: {
					module: 'esnext',
					verbatimModuleSyntax: false,
					allowImportingTsExtensions: false,
				},
			},
		],
		'^.+\\.js$': ['ts-jest', { useESM: true }],
	},
	transformIgnorePatterns: [
		'node_modules/(?!(protobufjs|long|@protobufjs|@types/long)/)',
	],
}

export default config
