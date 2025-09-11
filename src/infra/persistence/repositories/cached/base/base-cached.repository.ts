import type { Entity } from '@/core/domain/entity'
import type { RedisService } from '@/infra/providers/cache/redis-service'

type Mutable<T> = {
  -readonly [K in keyof T]: T[K]
}

type Item = Mutable<Entity>

interface PaginatedResult<T> {
  items: T[]
}

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
    const parseJson = (text: string) => {
      try {
        return JSON.parse(text)
      } catch {
        return null
      }
    }
    return [json]
      .map(parseJson)
      .filter(this.isRecord)
      .filter(this.hasStringId)
      .map(data => this.createEntityWithDates<T>(data))
      .find(Boolean) ?? null
  }

  protected parsePaginated<T extends Item> (json: string): PaginatedResult<T> | null {
    const parseJson = (text: string) => {
      try {
        return JSON.parse(text)
      } catch {
        return null
      }
    }
    const createPaginatedResult = (data: Record<string, unknown> & { items: unknown[] }) => ({
      items: data.items
        .map(item => this.parseEntity<T>(JSON.stringify(item)))
        .filter((item): item is T => item !== null)
    })

    return [json]
      .map(parseJson)
      .filter(this.isRecord)
      .filter(this.hasItemsArray)
      .map(createPaginatedResult)
      .find(Boolean) ?? null
  }

  private isRecord (value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null
  }

  private hasStringId (record: Record<string, unknown>): record is Record<string, unknown> & { id: string } {
    return 'id' in record && typeof record.id === 'string'
  }

  private hasItemsArray (record: Record<string, unknown>): record is Record<string, unknown> & { items: unknown[] } {
    return 'items' in record && Array.isArray(record.items)
  }

  private createEntityWithDates<T extends Item> (data: Record<string, unknown> & { id: string }): T | null {
    const convertToDate = (value: unknown): Date =>
      typeof value === 'string' ? new Date(value)
        : value instanceof Date ? value : new Date()
    const buildItem = (): Item => ({
      ...data,
      id: data.id,
      createdAt: convertToDate(data.createdAt),
      updatedAt: convertToDate(data.updatedAt)
    })
    const safeCreateItem = () => {
      try {
        return buildItem()
      } catch {
        return null
      }
    }

    return [data]
      .map(safeCreateItem)
      .filter(Boolean)
      .filter(item => this.isValidEntity<T>(item))
      .find(Boolean) ?? null
  }

  private isValidEntity<T extends Item> (item: Entity): item is T {
    return typeof item.id === 'string'
  }
}
