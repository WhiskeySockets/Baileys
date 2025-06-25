/** @type {import("prettier").Config} */
module.exports = {
	// Set a high print width to prevent Prettier from breaking lines,
	// especially long import statements and ternary expressions.
	printWidth: 120,

	// Use tabs for indentation, as seen in your original file.
	useTabs: true,

	// Set the width of a tab to 4 spaces.
	tabWidth: 4,

	// Omit semicolons at the end of statements.
	semi: false,

	// Use single quotes for strings instead of double quotes.
	singleQuote: true,

	// Keep trailing commas in multi-line objects and arrays, which is a common practice.
	trailingComma: 'es5',

	// Maintain spaces between brackets in object literals (e.g., { name: 'John' }).
	bracketSpacing: true,

	// Ensure parentheses are always around arrow function arguments (e.g., (arg) => ...).
	arrowParens: 'always',
}
