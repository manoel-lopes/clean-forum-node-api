import type { RedisService } from '@/infra/providers/cache/redis-service'

export abstract class BaseCachedRepository {
  constructor (protected readonly redis: RedisService) {}

  protected async cacheSet (key: string, value: string): Promise<void> {
    await this.redis.set(key, value)
  }

  protected async cacheGet (key: string): Promise<string | null> {
    return await this.redis.get(key)
  }

  protected async cacheDelete (...keys: string[]): Promise<void> {
    if (keys.length > 0) {
      await this.redis.delete(...keys)
    }
  }

  protected async invalidatePattern (pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern)
    if (keys.length > 0) {
      await this.redis.delete(...keys)
    }
  }

  protected entityKey (prefix: string, id: string): string {
    return `${prefix}:${id}`
  }

  protected listKey (prefix: string, params: Record<string, unknown>): string {
    const paramString = Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join(':')
    return `${prefix}:list:${paramString}`
  }
}
