import type { PaginatedUsers } from '@/application/repositories/users.repository'
import { BaseCachedMapper } from '@/infra/persistence/mappers/cached/base/base-cached-mapper'
import { User } from '@/domain/entities/user/user.entity'

type CachedUser = Omit<User, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt?: string
}

export class CachedUsersMapper extends BaseCachedMapper {
  static toDomain (cache: string): User | null {
    const item = JSON.parse(cache)
    if (this.isValid(item)) {
      return {
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined
      }
    }
    return null
  }

  static toPaginatedDomain (cache: string): PaginatedUsers {
    return super.toPaginated(cache, (cache: string) => this.toDomainArray(cache))
  }

  private static toDomainArray (cache: string): User[] {
    const item = JSON.parse(cache)
    const items = Array.isArray(item) ? item : [item]
    return items
      .map(item => this.toDomain(JSON.stringify(item)))
      .filter((item): item is User => item !== null)
  }

  private static isValid (parsedCache: unknown): parsedCache is CachedUser {
    return typeof parsedCache === 'object' &&
      parsedCache !== null &&
      'name' in parsedCache &&
      typeof parsedCache.name === 'string' &&
      'email' in parsedCache &&
      typeof parsedCache.email === 'string' &&
      'password' in parsedCache &&
      typeof parsedCache.password === 'string' &&
      'createdAt' in parsedCache &&
      typeof parsedCache.createdAt === 'string' &&
      (!('updatedAt' in parsedCache) || typeof parsedCache.updatedAt === 'string')
  }
}
