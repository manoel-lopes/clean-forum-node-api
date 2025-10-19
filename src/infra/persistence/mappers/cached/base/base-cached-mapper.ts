import type { PaginatedItems } from '@/core/domain/application/paginated-items'
import type { Entity } from '@/core/domain/entity'

export abstract class BaseCachedMapper {
  static toPersistence<Item extends Entity>(items: Item | Item[]): string {
    return JSON.stringify(items)
  }

  static toPaginatedPersistence<Item extends Entity>(items: PaginatedItems<Item>): string {
    return JSON.stringify(items)
  }

  protected static formatDate (date: Date): string {
    return date.toISOString()
  }

  protected static parseDate (dateString: string): Date {
    return new Date(dateString)
  }

  protected static toPaginated<Item extends Entity>(
    cache: string,
    toDomain: (cache: string) => Item[]
  ): PaginatedItems<Item> {
    const parsed = JSON.parse(cache)
    if (this.isPaginated(parsed)) {
      return {
        items: toDomain(JSON.stringify(parsed.items)),
        page: parsed.page,
        pageSize: parsed.pageSize,
        totalItems: parsed.totalItems,
        totalPages: parsed.totalPages,
        order: parsed.order,
      }
    }
    return {
      items: [],
      page: 1,
      pageSize: 0,
      totalItems: 0,
      totalPages: 0,
      order: 'desc',
    }
  }

  private static isPaginated<Item extends Entity>(parsedCache: unknown): parsedCache is PaginatedItems<Item> {
    return (
      typeof parsedCache === 'object' &&
      parsedCache !== null &&
      'items' in parsedCache &&
      Array.isArray(parsedCache.items) &&
      'page' in parsedCache &&
      typeof parsedCache.page === 'number' &&
      'pageSize' in parsedCache &&
      typeof parsedCache.pageSize === 'number' &&
      'totalItems' in parsedCache &&
      typeof parsedCache.totalItems === 'number' &&
      'totalPages' in parsedCache &&
      typeof parsedCache.totalPages === 'number' &&
      'order' in parsedCache &&
      typeof parsedCache.order === 'string'
    )
  }
}
