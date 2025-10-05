import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/**/*.ts',
    '!src/core/{application,presentation}/*.ts',
    '!src/**/*.{test,spec}.ts',
    '!src/application/repositories/*.ts',
    '!src/util/factories/*.ts',
    '!src/infra/persistence/seed/*.ts',
    '!src/**/{models,doubles,stubs,in-memory,types}/**/*.ts',
    '!tests/**/*.ts',
  ],
  clean: true,
  format: 'esm',
  splitting: false,
  sourcemap: false
})
