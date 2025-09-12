import { Redis } from 'ioredis'
import { env } from '@/lib/env'

export class RedisService {
  private readonly shortTTL = 60 * 10
  private readonly longTTL = 60 * 60 * 24
  private readonly client: Redis

  constructor () {
    this.client = new Redis({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      db: env.REDIS_DB,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    })
  }

  async get (key: string): Promise<string | null> {
    return await this.client.get(key)
  }

  async set (key: string, value: string, ttl?: number): Promise<void> {
    await this.client.setex(key, ttl || this.longTTL, value)
  }

  async setShort (key: string, value: string): Promise<void> {
    await this.client.setex(key, this.shortTTL, value)
  }

  async delete (...keys: string[]): Promise<void> {
    if (keys.length > 0) {
      await this.client.del(...keys)
    }
  }

  async smembers (key: string): Promise<string[]> {
    return await this.client.smembers(key)
  }

  async sadd (key: string, value: string): Promise<void> {
    await this.client.sadd(key, value)
  }

  async mget (keys: string[]): Promise<(string | null)[]> {
    return await this.client.mget(keys)
  }

  entityKey (prefix: string, id: string): string {
    return `${prefix}:${id}`
  }

  listKey (prefix: string, params: Record<string, unknown>): string {
    const paramString = Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}:${String(value).replace(/:/g, '|')}`)
      .join(':')
    return `${prefix}:${paramString}`
  }

  async getWithFallback<T> (key: string, toDomain: (cache: string) => T | null): Promise<T | null> {
    try {
      const cached = await this.get(key)
      if (!cached) return null
      return toDomain(cached)
    } catch {
      await this.delete(key)
      return null
    }
  }

  async disconnect (): Promise<void> {
    await this.client.quit()
  }
}
