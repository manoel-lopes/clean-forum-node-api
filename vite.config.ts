import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'node:path'
import { configDefaults, defineConfig } from 'vitest/config'

const exclude = [
  ...configDefaults.exclude,
  'src/main',
]

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      '@/': resolve('./src/'),
    },
  },
  test: {
    exclude,
    globals: true,
    coverage: {
      provider: 'istanbul',
      exclude: [
        ...exclude,
        '**/prisma/**',
        'test/**',
        'src/lib',
        'src/util',
        'src/external',
        'src/infra/adapters/http/http-server/fasitfy',
        'src/infra/persistence/repositories/cache',
        'src/infra/providers/cache/redis',
      ],
    },
  },
})

function resolve (dir: string) {
  return path.join(__dirname, dir)
}
