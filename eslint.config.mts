import { defineConfig, globalIgnores } from "eslint/config";
import prettier from "eslint-plugin-prettier";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import base from "@whiskeysockets/eslint-config";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores([
    "src/Tests/*",
    "**/lib",
    "**/coverage",
    "**/*.lock",
    "**/.eslintrc.json",
    "src/WABinary/index.ts",
    "**/WAProto",
    "Example/Example.ts",
    "**/docs",
    "**/proto-extract",
]),
...base,
{
    extends: compat.extends("plugin:prettier/recommended"),

    plugins: {
        prettier,
    },

    languageOptions: {
        ecmaVersion: 5,
        sourceType: "module",

        parserOptions: {
            project: "./tsconfig.json",
        },
    },

    rules: {
        camelcase: "off",
        indent: "off",

        "@typescript-eslint/no-explicit-any": ["warn", {
            ignoreRestArgs: true,
        }],

        "@typescript-eslint/no-inferrable-types": ["warn"],
        "@typescript-eslint/no-redundant-type-constituents": ["warn"],
        "@typescript-eslint/no-unnecessary-type-assertion": ["warn"],
        "no-restricted-syntax": "off",
        "keyword-spacing": "off",
        "implicit-arrow-linebreak": ["off"],

        "space-before-function-paren": ["error", {
            anonymous: "always",
            named: "never",
            asyncArrow: "always",
        }],

        "@typescript-eslint/no-unused-vars": ["error", {
            caughtErrors: "none",
        }],
    },
}]);
