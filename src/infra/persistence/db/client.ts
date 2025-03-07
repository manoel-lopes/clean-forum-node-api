import { env } from '@/lib/env'
import { PrismaClient } from '@prisma/client'

const log: Record<string, string[]> = {
  development: ['query'],
  production: ['error', 'warn'],
  test: [],
}

export const prisma = new PrismaClient({
  log: log[env.NODE_ENV || 'development'],
})
