import type { RedisService } from '@/infra/providers/cache/redis-service'

interface BaseEntity {
  id: string
  createdAt?: Date
  updatedAt?: Date
}

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

  protected parseEntity<T extends BaseEntity> (json: string): T | null {
    try {
      const parsed: unknown = JSON.parse(json)
      if (!this.isRecord(parsed)) {
        return null
      }
      if (!this.hasStringId(parsed)) {
        return null
      }
      return this.createEntityWithDates<T>(parsed)
    } catch {
      return null
    }
  }

  protected parsePaginated<T extends BaseEntity> (json: string): PaginatedResult<T> | null {
    try {
      const parsed: unknown = JSON.parse(json)
      if (!this.isRecord(parsed)) {
        return null
      }
      if (!this.hasItemsArray(parsed)) {
        return null
      }
      const validItems = parsed.items
        .map(item => this.parseEntity<T>(JSON.stringify(item)))
        .filter((item): item is T => item !== null)
      return {
        items: validItems
      }
    } catch {
      return null
    }
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

  private createEntityWithDates<T extends BaseEntity> (data: Record<string, unknown> & { id: string }): T | null {
    try {
      const entity: BaseEntity = {
        ...data,
        id: data.id
      }
      if (typeof data.createdAt === 'string') {
        entity.createdAt = new Date(data.createdAt)
      } else if (data.createdAt instanceof Date) {
        entity.createdAt = data.createdAt
      }
      if (typeof data.updatedAt === 'string') {
        entity.updatedAt = new Date(data.updatedAt)
      } else if (data.updatedAt instanceof Date) {
        entity.updatedAt = data.updatedAt
      }
      if (this.isValidEntity<T>(entity)) {
        return entity
      }
      return null
    } catch {
      return null
    }
  }

  private isValidEntity<T extends BaseEntity> (entity: BaseEntity): entity is T {
    return typeof entity.id === 'string' &&
           entity.id.length > 0
  }
}
