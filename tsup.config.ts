import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/**/*.ts',
    '!src/core/{application,presentation}/*.ts',
    '!src/**/*.{test, spec}.ts',
    '!src/application/repositories/*.ts',
    '!src/util/factories/*.ts',
    '!src/**/{models,ports,doubles,stubs,in-memory,types}/**/*.ts',
  ],
  clean: true,
})
