import { BaseCachedMapper } from '@/infra/persistence/mappers/cached/base/base-cached-mapper'
import type { RefreshToken } from '@/domain/enterprise/entities/refresh-token.entity'

type CachedRefreshToken = Omit<RefreshToken, 'createdAt' | 'updatedAt' | 'expiresAt'> & {
  createdAt: string
  expiresAt: string
}

export class CachedRefreshTokensMapper extends BaseCachedMapper {
  static toDomain (cache: string): RefreshToken | null {
    const item = JSON.parse(cache)
    if (this.isValid(item)) {
      return {
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.createdAt),
        expiresAt: new Date(item.expiresAt)
      }
    }
    return null
  }

  private static isValid (parsedCache: unknown): parsedCache is CachedRefreshToken {
    return typeof parsedCache === 'object' &&
      parsedCache !== null &&
      'userId' in parsedCache &&
      typeof parsedCache.userId === 'string' &&
      'expiresAt' in parsedCache &&
      typeof parsedCache.expiresAt === 'string' &&
      'createdAt' in parsedCache &&
      typeof parsedCache.createdAt === 'string'
  }
}
