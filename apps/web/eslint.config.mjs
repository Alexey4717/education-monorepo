import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';
import baseConfig from '../../eslint.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    resolvePluginsRelativeTo: __dirname,
});

export default [
    ...baseConfig,
    ...compat.extends('next/core-web-vitals'),
    {
        rules: {
            'react/jsx-max-props-per-line': ['error', { maximum: 4 }],
        },
    },
];
