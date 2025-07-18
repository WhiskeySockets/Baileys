import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import pluginPrettier from 'eslint-plugin-prettier';

export default tseslint.config(
  {
    ignores: [
      'lib/',
      'coverage/',
      '*.lock',
      'src/WABinary/index.ts',
      'WAProto/',
      'Example/Example.ts',
      'docs/',
      'proto-extract/',
      'src/Tests/*',
      'WASignalGroup/',
      '*.json',
    ],
  },
  {
    files: ['src/**/*.ts'],
    extends: [
      ...tseslint.configs.recommended,
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        project: './tsconfig.json',
        sourceType: 'module',
      },
    },
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      // Prettier rules
      ...eslintConfigPrettier.rules,
      'prettier/prettier': ['error', {
        useTabs: true,
        tabWidth: 2,
        semi: false,
        singleQuote: true,
        jsxSingleQuote: true,
        bracketSpacing: true,
        arrowParens: 'avoid',
        printWidth: 120,
        trailingComma: 'none',
      }],
    
      'camelcase': 'off',
      'indent': 'off',
      '@typescript-eslint/no-inferrable-types': ['warn'],
      '@typescript-eslint/no-redundant-type-constituents': ['warn'],
      '@typescript-eslint/no-unnecessary-type-assertion': ['warn'],
			'@typescript-eslint/no-non-null-asserted-optional-chain': ['off'],
			'@typescript-eslint/no-unused-expressions': ['off'],
			'@typescript-eslint/ban-ts-comment': ['off'],
			'@typescript-eslint/no-empty-object-type': ['off'],
			'@typescript-eslint/no-explicit-any': ['warn'],
			'@typescript-eslint/no-duplicate-enum-values': ['warn'],
      'no-restricted-syntax': 'off',
      'keyword-spacing': 'off',
      'implicit-arrow-linebreak': ['off'],
      'space-before-function-paren': [
        'error',
        {
          anonymous: 'always',
          named: 'never',
          asyncArrow: 'always',
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          caughtErrors: 'none',
        },
      ],
    },
  }
);