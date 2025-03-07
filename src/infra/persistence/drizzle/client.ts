import { drizzle } from 'drizzle-orm/node-postgres'
import { env } from '@/lib/env'
import { dbCredentials } from './credential'

const db = drizzle({
  connection: dbCredentials,
  logger: env.NODE_ENV !== 'production',
})

export { db }
