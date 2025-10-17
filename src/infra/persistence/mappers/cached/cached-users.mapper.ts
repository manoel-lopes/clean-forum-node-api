import type { PaginatedUsers } from '@/domain/application/repositories/users.repository'
import { BaseCachedMapper } from '@/infra/persistence/mappers/cached/base/base-cached-mapper'
import type { User } from '@/domain/enterprise/entities/user.entity'

type CachedUser = Omit<User, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt?: string
}

export class CachedUsersMapper extends BaseCachedMapper {
  static toDomain(cache: string): User | null {
    const item = JSON.parse(cache)
    if (this.isValid(item)) {
      const user: User = {
        id: item.id,
        name: item.name,
        email: item.email,
        password: item.password,
        createdAt: new Date(item.createdAt),
        updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(item.createdAt),
      }
      return user
    }
    return null
  }

  static toPaginatedDomain(cache: string): PaginatedUsers {
    return super.toPaginated(cache, (cache: string) => {
      const item = JSON.parse(cache)
      const items = Array.isArray(item) ? item : [item]
      return items.map((item) => this.toDomain(JSON.stringify(item))).filter((item): item is User => item !== null)
    })
  }

  private static isValid(parsedCache: unknown): parsedCache is CachedUser {
    return (
      typeof parsedCache === 'object' &&
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
    )
  }
}
