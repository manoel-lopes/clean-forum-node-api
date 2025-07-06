import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'
import neostandard, { resolveIgnoresFromGitignore } from 'neostandard'
import tseslint from 'typescript-eslint'
import eslintPluginImport from 'eslint-plugin-import'

import eslint from '@eslint/js'
import vitest from '@vitest/eslint-plugin'

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...neostandard({
    ignores: resolveIgnoresFromGitignore(),
  }),
  {
    ignores: ['**/*', '!src/**'],
  },
  {
    plugins: {
      vitest,
      'unused-imports': unusedImports,
      'simple-import-sort': simpleImportSort,
      import: eslintPluginImport,
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
      parserOptions: {
        project: [
          './tsconfig.json',
        ],
      },
    },
    rules: {
      'no-useless-constructor': 'off',
      '@typescript-eslint/no-useless-constructor': 'off',
      'no-unused-vars': 'off',
      'no-var': 'error',
      'no-console': ['error', { allow: ['error'] }],
      '@stylistic/max-len': 'off',
      '@stylistic/function-paren-newline': 'off',
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
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^[^@./]', '^node:', '^@fastify', '^vitest', '^supertest'],
            ['^@/external'],
            ['^@/core/presentation', '^@/core/application', '^@/core/domain'],
            ['^@/external'],
            ['^@/infra', '^@/infra/.*/ports', '^@/infra/.*/errors'],
            ['^@/application/repositories', '^@/application/usecases', '^@/application/errors'],
            ['^@/domain/entities', '^@/domain/value-objects'],
            ['^@/domain'],
            ['^@/presentation'],
            ['^@/main'],
            ['^@/util'],
            ['^@/lib'],
            ['^\.'],
          ],
        },
      ],
      'simple-import-sort/exports': 'warn',
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/namespace': 'error',
      'import/default': 'error',
      'import/export': 'error',
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
  },
]
