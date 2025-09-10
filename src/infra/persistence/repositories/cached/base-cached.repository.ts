import type { RedisService } from '@/infra/providers/cache/redis-service'

export abstract class BaseCachedRepository {
  constructor (protected readonly redis: RedisService) {}

  protected async cacheGet (key: string): Promise<string | null> {
    return await this.redis.get(key)
  }

  protected async cacheSet (key: string, value: string): Promise<void> {
    await this.redis.set(key, value)
  }

  protected async cacheDelete (...keys: string[]): Promise<void> {
    if (keys.length > 0) {
      await this.redis.delete(...keys)
    }
  }

  protected async invalidateByPattern (pattern: string): Promise<void> {
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
      .map(([key, value]) => `${key}:${value}`)
      .join(':')
    return `${prefix}:${paramString}`
  }

  protected parseEntity<T> (json: string): T {
    const parsed = JSON.parse(json) as Record<string, unknown>
    // Simple date conversion for common fields
    if (typeof parsed.createdAt === 'string') {
      parsed.createdAt = new Date(parsed.createdAt)
    }
    if (typeof parsed.updatedAt === 'string') {
      parsed.updatedAt = new Date(parsed.updatedAt)
    }
    return parsed as T
  }

  protected parsePaginated<T> (json: string): T {
    const parsed = JSON.parse(json) as Record<string, unknown>
    // Convert dates in items array
    if (Array.isArray(parsed.items)) {
      parsed.items = parsed.items.map(item => {
        const itemStr = JSON.stringify(item)
        return this.parseEntity(itemStr)
      })
    }
    return parsed as T
  }
}
