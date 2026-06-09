import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'build'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      // New strict rule in eslint-plugin-react-hooks v7. It fires on the
      // legacy "close modal / clear local state after async success" pattern
      // sprinkled across the modal forms — those effects intentionally
      // synchronise local component state with the result of a Redux thunk.
      // Refactoring each one (lift to event handler, useMemo, or move to a
      // post-action callback) is out of scope for the eslint bump; revisit
      // once we're untangling the action shims.
      'react-hooks/set-state-in-effect': 'off',
    },
  }
);
