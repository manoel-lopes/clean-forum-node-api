import { Redis } from 'ioredis'
import { conn } from '@/infra/persistence/redis/conn'

export class RedisService {
  private readonly ttl = 60 * 60 * 24
  private readonly client: Redis

  constructor () {
    this.client = new Redis(conn)
  }

  async set (key: string, value: string): Promise<void> {
    await this.client.setex(key, this.ttl, value)
  }

  async get<T>(key: string, toDomain: (cache: string) => T | null): Promise<T | null> {
    try {
      const cached = await this.client.get(key)
      if (!cached) return null
      return toDomain(cached)
    } catch {
      await this.delete(key)
      return null
    }
  }

  async delete (...keys: string[]): Promise<void> {
    if (keys.length > 0) {
      await this.client.del(...keys)
    }
  }

  async deletePattern (pattern: string): Promise<void> {
    const keys = await this.client.keys(pattern)
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
      .filter(([, value]) => value !== undefined && value !== null)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}:${String(value).replace(/:/g, '|')}`)
      .join(':')
    return paramString ? `${prefix}:${paramString}` : `${prefix}:default`
  }

  async disconnect (): Promise<void> {
    await this.client.quit()
  }
}
