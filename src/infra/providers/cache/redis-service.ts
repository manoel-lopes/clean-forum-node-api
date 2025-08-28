import { Redis } from 'ioredis'
import { env } from '@/lib/env'

export class RedisService {
  private readonly ttl = 60 * 60 * 24
  private readonly redis: Redis

  constructor () {
    this.redis = new Redis({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      db: env.REDIS_DB,
    })
  }

  async get (key: string): Promise<string | null> {
    return await this.redis.get(key)
  }

  async set (key: string, value: string): Promise<void> {
    await this.redis.setex(key, this.ttl, value)
  }

  async delete (...keys: string[]): Promise<void> {
    await this.redis.del(...keys)
  }

  async smembers (key: string): Promise<string[]> {
    return await this.redis.smembers(key)
  }

  async sadd (key: string, value: string): Promise<void> {
    await this.redis.sadd(key, value)
  }

  async mget (keys: string[]): Promise<(string | null)[]> {
    return await this.redis.mget(keys)
  }
}
