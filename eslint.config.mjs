import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import neostandard, { resolveIgnoresFromGitignore } from 'neostandard'
import vitest from '@vitest/eslint-plugin'
import unusedImports from 'eslint-plugin-unused-imports'
import importNewlines from 'eslint-plugin-import-newlines'

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...neostandard({
    ignores: resolveIgnoresFromGitignore(),
  }),
  {
    plugins: {
      vitest,
      'import-newlines': importNewlines,
      'unused-imports': unusedImports,
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
    rules: {
      'unused-imports/no-unused-imports': 'error',
      'import-newlines/enforce': ['error', { items: 1000, 'max-len': 102 }],
      'no-useless-constructor': 'off',
      '@typescript-eslint/no-useless-constructor': 'off',
      'no-unused-vars': 'off',
      'no-var': 'error',
      'no-console': ['error', { allow: ['error'] }],
      '@stylistic/function-paren-newline': ['warn', 'multiline'],
      '@stylistic/space-before-function-paren': [
        'warn',
        { anonymous: 'always', asyncArrow: 'always', named: 'always' },
      ],
      '@stylistic/multiline-ternary': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/parameter-properties': [
        'error',
        { allow: ['readonly', 'private', 'private readonly'] },
      ],
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
]
