import eslint from '@eslint/js';
import prettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import preact from 'eslint-config-preact';
import json from '@eslint/json';

export default tseslint.config([
  eslint.configs.recommended,
  tseslint.configs.recommended,
  prettier,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['**/*.{jsx,tsx}'],
    extends: [...preact],
  },

  {
    files: ['**/*.json'],
    language: 'json/json',
    plugins: {
      json,
    },
    rules: {
      'json/no-duplicate-keys': 'error',
      'no-irregular-whitespace': 'off',
    },
  },
]);
