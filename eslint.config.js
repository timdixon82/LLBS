// ESLint flat config (ESLint 9+).
// strategy.js runs in the browser as a classic script (no module system).
// brand.js and brand-logic.js run as an ES module (brand.html loads
// brand.js with <script type="module">) since brand-logic.js was
// extracted from brand.js (work 051) so its colour/contrast and layout
// maths could be unit tested in isolation. Browser globals come from the
// `globals` package so the no-undef rule catches real undefined
// references without a hand-kept list. Test files also need Node
// globals, since Vitest runs them under Node.

import globals from 'globals';

export default [
  {
    files: ['js/strategy.js'],
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
  {
    files: ['js/brand.js', 'js/brand-logic.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
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
  {
    files: ['js/**/*.test.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
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
