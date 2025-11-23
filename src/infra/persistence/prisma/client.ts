import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma'
import pg from 'pg'

import { env } from '@/lib/env'

const log: Record<string, ('query' | 'info' | 'warn' | 'error')[]> = {
  development: ['query'],
  production: ['error', 'warn'],
  test: [],
}

const pool = new pg.Pool({ connectionString: env.DATABASE_URL })
const adapter = new PrismaPg(pool)

export const prisma = new PrismaClient({
  adapter,
  log: log[env.NODE_ENV || 'development'],
})
