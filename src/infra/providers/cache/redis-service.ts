import { Redis } from 'ioredis'
import { conn } from '@/infra/persistence/redis/conn'

export class RedisService {
  private readonly ttl = 60 * 60 * 24
  private readonly client: Redis

  constructor () {
    this.client = new Redis(conn)
  }

  async set (key: string, value: string): Promise<void> {
    try {
      await this.client.setex(key, this.ttl, value)
    } catch {
    }
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
    try {
      if (keys.length > 0) {
        await this.client.del(...keys)
      }
    } catch {
    }
  }

  async deletePattern (pattern: string): Promise<void> {
    try {
      const keys = await this.client.keys(pattern)
      if (keys.length > 0) {
        await this.client.del(...keys)
      }
    } catch {
    }
  }

  async smembers (key: string): Promise<string[]> {
    try {
      return await this.client.smembers(key)
    } catch {
      return []
    }
  }

  async sadd (key: string, value: string): Promise<void> {
    try {
      await this.client.sadd(key, value)
    } catch {
    }
  }

  async mget (keys: string[]): Promise<(string | null)[]> {
    try {
      return await this.client.mget(keys)
    } catch {
      return keys.map(() => null)
    }
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

  async getInfo (): Promise<string> {
    return await this.client.info()
  }

  async getMemoryStats (): Promise<string> {
    return await this.client.info('memory')
  }

  async getStats (): Promise<string> {
    return await this.client.info('stats')
  }

  async getServerInfo (): Promise<string> {
    return await this.client.info('server')
  }

  async getClientsInfo (): Promise<string> {
    return await this.client.info('clients')
  }

  getClient (): Redis {
    return this.client
  }
}
