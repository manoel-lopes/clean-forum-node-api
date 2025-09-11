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

  async set (key: string, value: string, ttl?: number): Promise<void> {
    await this.redis.setex(key, ttl || this.ttl, value)
  }

  async delete (...keys: string[]): Promise<void> {
    if (keys.length > 0) {
      await this.redis.del(...keys)
    }
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

  async keys (pattern: string): Promise<string[]> {
    return await this.redis.keys(pattern)
  }

  entityKey (prefix: string, id: string): string {
    return `${prefix}:${id}`
  }

  listKey (prefix: string, params: Record<string, unknown>): string {
    const paramString = Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}:${value}`)
      .join(':')
    return `${prefix}:${paramString}`
  }

  async getWithFallback<T> (key: string, toDomain: (cache: string) => T | null): Promise<T | null> {
    const cached = await this.get(key)
    if (!cached) return null
    try {
      return toDomain(cached)
    } catch {
      await this.delete(key)
      return null
    }
  }
}
