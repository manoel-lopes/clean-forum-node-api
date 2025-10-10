import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/**/*.ts',
    // Exclude test files
    '!src/**/*.{test,spec}.ts',
    '!tests/**/*.ts',
    // Exclude test-related directories
    '!src/**/in-memory/**/*.ts',
    '!src/**/doubles/**/*.ts',
    '!src/**/stubs/**/*.ts',
    '!src/**/test/**/*.ts',
    // Exclude seed files
    '!src/infra/persistence/seed.ts',
    '!src/infra/persistence/seed/**/*.ts',
    // Exclude test factories
    '!src/shared/util/factories/**/*.ts',
    // Exclude type-only files (not needed at runtime)
    '!src/core/**/*.ts',
    '!src/**/types/**/*.ts',
    '!src/shared/types/**/*.ts',
  ],
  clean: true,
  format: 'esm',
  splitting: false,
  sourcemap: false,
  minify: false,
  treeshake: true,
})
