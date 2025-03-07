import { defineConfig } from 'drizzle-kit'
import { dbCredentials } from './src/infra/persistence/drizzle/credential'

export default defineConfig({
  dialect: 'postgresql',
  schema: 'src/infra/persistence/drizzle/schemas/**.schema.ts',
  out: 'src/infra/persistence/drizzle/migrations',
  dbCredentials,
})
