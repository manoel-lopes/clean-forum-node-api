import type { RefreshTokensRepository } from '@/application/repositories/refresh-tokens.repository'
import { CachedRefreshTokensMapper } from '@/infra/persistence/mappers/cached/cached-refresh-tokens.mapper'
import type { RedisService } from '@/infra/providers/cache/redis-service'
import type { RefreshToken } from '@/domain/entities/refresh-token/refresh-token.entity'
import { BaseCachedRepository } from './base/base-cached.repository'

export class CachedRefreshTokensRepository extends BaseCachedRepository implements RefreshTokensRepository {
  private readonly keyPrefix = 'refresh-tokens'

  constructor (
    redis: RedisService,
    private readonly refreshTokensRepository: RefreshTokensRepository
  ) {
    super(redis)
  }

  private refreshTokenKey (id: string): string {
    return this.entityKey(this.keyPrefix, id)
  }

  private refreshTokenUserKey (userId: string): string {
    return this.userKey(userId)
  }

  async save (refreshToken: RefreshToken): Promise<void> {
    await this.refreshTokensRepository.save(refreshToken)
    await this.cacheSet(this.refreshTokenKey(refreshToken.id), CachedRefreshTokensMapper.toPersistence(refreshToken))
    await this.cacheSet(this.refreshTokenUserKey(refreshToken.userId), CachedRefreshTokensMapper.toPersistence(refreshToken))
  }

  async findById (id: string): Promise<RefreshToken | null> {
    const cached = await this.cacheGet(this.refreshTokenKey(id))
    if (cached) {
      try {
        return CachedRefreshTokensMapper.toDomain(cached)
      } catch {
        await this.cacheDelete(this.refreshTokenKey(id))
      }
    }
    const refreshToken = await this.refreshTokensRepository.findById(id)
    if (refreshToken) {
      await this.cacheSet(this.refreshTokenKey(refreshToken.id), CachedRefreshTokensMapper.toPersistence(refreshToken))
      await this.cacheSet(this.refreshTokenUserKey(refreshToken.userId), CachedRefreshTokensMapper.toPersistence(refreshToken))
    }
    return refreshToken
  }

  async findByUserId (userId: string): Promise<RefreshToken | null> {
    const cached = await this.cacheGet(this.refreshTokenUserKey(userId))
    if (cached) {
      try {
        return CachedRefreshTokensMapper.toDomain(cached)
      } catch {
        await this.cacheDelete(this.refreshTokenUserKey(userId))
      }
    }
    const refreshToken = await this.refreshTokensRepository.findByUserId(userId)
    if (refreshToken) {
      await this.cacheSet(this.refreshTokenKey(refreshToken.id), CachedRefreshTokensMapper.toPersistence(refreshToken))
      await this.cacheSet(this.refreshTokenUserKey(refreshToken.userId), CachedRefreshTokensMapper.toPersistence(refreshToken))
    }
    return refreshToken
  }

  async deleteManyByUserId (userId: string): Promise<void> {
    await this.refreshTokensRepository.deleteManyByUserId(userId)
    await this.cacheDelete(this.refreshTokenUserKey(userId))
  }

  private userKey (userId: string) {
    return `refresh-tokens:userId:${userId}`
  }
}
