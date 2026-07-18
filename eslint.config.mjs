import nextVitals from 'eslint-config-next/core-web-vitals';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

const config = [
  globalIgnores(['.next/**', 'out/**', 'build/**', 'dist/**', 'node_modules/**']),
  {
    ignores: ['vite.config.ts', 'vitest.config.ts'],
  },

  ...nextVitals,

  {
    ...reactPlugin.configs.flat.recommended,
    settings: { react: { version: 'detect' } },
  },
  {
    ...reactPlugin.configs.flat['jsx-runtime'],
    settings: { react: { version: 'detect' } },
  },

  {
    plugins: { import: importPlugin },
    settings: {
      'import/resolver': {
        typescript: true,
      },
    },
    rules: {
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/no-duplicates': 'error',
      'import/order': 'off',
    },
  },

  reactHooks.configs.flat.recommended,

  ...tseslint.configs.recommended,

  {
    plugins: { '@typescript-eslint': tseslint.plugin },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    },
  },

  prettierConfig,
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      'prettier/prettier': 'error',
    },
  },
];

export default config;
