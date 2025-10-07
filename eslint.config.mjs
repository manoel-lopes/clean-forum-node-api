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
    ignores: ['**/*', '!src/**', '!tests/**'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
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
        project: ['./tsconfig.json'],
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
      'padded-blocks': 'off',

      'lines-between-class-members': ['warn', {
        enforce: [
          { blankLine: 'never', prev: 'field', next: 'field' },
          { blankLine: 'always', prev: 'method', next: 'method' },
          { blankLine: 'always', prev: 'field', next: 'method' },
          { blankLine: 'always', prev: 'method', next: 'field' },
        ],
      }],
      'no-multiple-empty-lines': ['warn', { max: 1, maxBOF: 0, maxEOF: 0 }],
      'neostandard/lines-between-class-members': 'off',
      'neostandard/padded-blocks': 'off',
      'neostandard/no-multiple-empty-lines': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/parameter-properties': ['error', {
        allow: [
          'readonly',
          'private',
          'private readonly',
          'protected',
          'protected readonly',
        ],
      }],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreClassWithStaticInitBlock: true,
          reportUsedIgnorePattern: false
        },
      ],
      'no-unused-private-class-members': 'warn',
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': 'off',
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            [
              '^node:', '^[^@./]', '^zod', '^fastify', '^@fastify', '^vitest', '^supertest',
              '^@/external',
              '^@/core/presentation', '^@/core/application', '^@/core/domain',
              '^@/external',
              '^@/domain/entities', '^@/domain/value-objects',
              '^@/domain/application/.*',
              '^@/infra', '^@/infra/.*/ports', '^@/infra/.*/errors',
              '^@/domain',
              '^@/presentation',
              '^@/main',
              '^@/util',
              '^@/lib',
              '^@/shared',
              '^\.',
            ],
          ],
        },
      ],
      'simple-import-sort/exports': 'warn',
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/namespace': 'error',
      'import/default': 'error',
      'import/export': 'error',
      '@stylistic/padding-line-between-statements': [
        'warn',
        // Imports
        { blankLine: 'always', prev: 'import', next: '*' },
        { blankLine: 'never', prev: 'import', next: 'import' },

        // Functions and classes
        { blankLine: 'always', prev: '*', next: 'function' },
        { blankLine: 'always', prev: 'function', next: '*' },

        { blankLine: 'never', prev: 'const', next: 'const' },
        { blankLine: 'never', prev: 'let', next: 'let' },
        { blankLine: 'never', prev: 'const', next: 'let' },
        { blankLine: 'never', prev: 'let', next: 'const' },
        { blankLine: 'never', prev: 'if', next: '*' },

        { blankLine: 'never', prev: 'const', next: 'expression' },
        // { blankLine: 'always', prev: 'function', next: 'expression' },
      ],
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
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      '@stylistic/padding-line-between-statements': 'off',
      '@stylistic/padding-line-between-statements': [
        'warn',
        // Imports
        { blankLine: 'always', prev: 'import', next: '*' },
        { blankLine: 'never', prev: 'import', next: 'import' },

        // { blankLine: 'never', prev: 'const', next: 'const' },
        // { blankLine: 'never', prev: 'let', next: 'let' },
        // { blankLine: 'never', prev: 'const', next: 'let' },
        { blankLine: 'never', prev: 'let', next: 'const' },
        // { blankLine: 'always', prev: ['let'], next: 'expression' },
      ],
    },
  }
]
