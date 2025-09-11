import type { RedisService } from '@/infra/providers/cache/redis-service'
import {
  hasItemsArray,
  hasStringId,
  isRecord,
  isValidEntity,
  type Item,
  type PaginatedResult,
  parseJson,
  safeCreateItem
} from '@/lib/cache'

export abstract class BaseCachedRepository {
  constructor (private readonly redis: RedisService) {}

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

  protected parseEntity<T extends Item> (json: string): T | null {
    return [json]
      .map(parseJson)
      .filter(isRecord)
      .filter(hasStringId)
      .map(this.createEntityWithDates<T>)
      .find(Boolean) ?? null
  }

  protected parsePaginated<T extends Item> (json: string): PaginatedResult<T> | null {
    return [json]
      .map(parseJson)
      .filter(isRecord)
      .filter(hasItemsArray)
      .map(this.createPaginatedResult<T>)
      .find(Boolean) ?? null
  }

  private createPaginatedResult<T extends Item> (data: Record<string, unknown> & { items: unknown[] }): PaginatedResult<T> {
    return {
      items: data.items
        .map(item => this.parseEntity<T>(JSON.stringify(item)))
        .filter((item): item is T => item !== null)
    }
  }

  private createEntityWithDates<T extends Item> (data: Record<string, unknown> & { id: string }): T | null {
    return [data]
      .map(safeCreateItem)
      .filter(Boolean)
      .filter(isValidEntity<T>)
      .find(Boolean) ?? null
  }
}
