import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  // Never linted: build output, local data, vendored third-party assets.
  {
    ignores: [
      'dist/',
      'data/',
      'src/static/js/react.production.min.js',
      'src/static/js/react-dom.production.min.js',
      'src/static/js/react-bootstrap.js',
      'src/static/js/babel.min.js',
    ],
  },

  {
    files: ['src/**/*.ts'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },

  {
    files: ['spec/**/*.js'],
    extends: [js.configs.recommended],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node, ...globals.jest },
    },
    rules: {
      'no-unused-vars': 'warn',
    },
  },

  {
    files: ['src/static/js/app.js'],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: {
        ...globals.browser,
        React: 'readonly',
        ReactDOM: 'readonly',
        ReactBootstrap: 'readonly',
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      'no-unused-vars': 'warn',
    },
  },

  prettier
);
