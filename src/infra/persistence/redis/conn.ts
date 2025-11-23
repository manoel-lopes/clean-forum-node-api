import { env } from '@/lib/env'

export const conn = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  db: env.REDIS_DB,
  maxRetriesPerRequest: null,
  lazyConnect: true,
  connectTimeout: 30000,
  commandTimeout: 30000,
  retryStrategy: (times: number) => {
    if (times > 3) return null
    return Math.min(times * 50, 2000)
  },
}
