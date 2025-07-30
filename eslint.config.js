import prettier from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import json from '@eslint/json';
import { globalIgnores } from 'eslint/config';

export default tseslint.config([
  globalIgnores(['node_modules', 'dist']),
  prettier,
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
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
