import Redis from 'ioredis'
import { env } from '@/lib/env'
import type { CacheService } from '../ports/cache-service'

export class RedisProvider implements CacheService {
  private readonly client = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    db: env.REDIS_DB
  })

  async set (key: string, value: string): Promise<void> {
    await this.client.set(key, value)
  }

  async get (key: string): Promise<string | null> {
    return await this.client.get(key)
  }

  async delete (key: string): Promise<void> {
    await this.client.del(key)
  }
}
