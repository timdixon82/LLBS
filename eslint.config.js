// ESLint flat config (ESLint 9+).
// Both JS files run in the browser as classic scripts (no module system).
// Browser globals come from the `globals` package so the no-undef rule
// catches real undefined references without a hand-kept list.

import globals from 'globals';

export default [
  {
    files: ['js/**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'script',
      globals: globals.browser,
    },
    rules: {
      'no-unused-vars': ['error', { caughtErrorsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'eqeqeq': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
    },
  },
];
