import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import tsESLint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectPath = join(__dirname, 'tsconfig.base.json');

export default [
	{
		ignores: [
			'**/node_modules/**',
			'**/.next/**',
			'**/dist/**',
			'**/eslint.config.js',
			'**/jest.config.js',
		],
	},
	// Базовый ESLint (JS/TS)
	{
		files: ['**/*.{js,ts,tsx}'],
		ignores: ['**/dist/**', '**/.next/**', '**/node_modules/**'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				project: projectPath,
			},
		},
		plugins: {
			'@typescript-eslint': tsESLint,
			'unused-imports': unusedImportsPlugin,
		},
		rules: {
			...tsESLint.configs['recommended'].rules,
			'unused-imports/no-unused-imports': 'warn',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-unused-vars': 'warn',
		},
	},

	// Prettier
	eslintConfigPrettier,
];
