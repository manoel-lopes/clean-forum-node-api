import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import neostandard, { resolveIgnoresFromGitignore } from 'neostandard'
import vitest from '@vitest/eslint-plugin'

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...neostandard({
    ignores: resolveIgnoresFromGitignore(),
  }),
  {
    plugins: {
      vitest,
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
    rules: {
      'no-useless-constructor': 'off',
      '@typescript-eslint/no-useless-constructor': 'off',
      'no-unused-vars': 'off',
      'no-var': 'error',
      'no-console': ['error', { allow: ['error'] }],
      '@stylistic/function-paren-newline': ['warn', 'multiline'],
      '@stylistic/max-len': ['warn', {
        code: 102,
        tabWidth: 2,
        ignoreUrls: true,
        ignoreComments: false,
      }],
      '@stylistic/space-before-function-paren': ['warn', {
        anonymous: 'always',
        asyncArrow: 'always',
        named: 'always',
      }],
      '@stylistic/multiline-ternary': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/parameter-properties': ['error', {
        allow: [
          'readonly',
          'private',
          'private readonly'],
      }],
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
    },
  },
]
