import { env } from '@/lib/env'

export const conn = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  db: env.REDIS_DB,
}
