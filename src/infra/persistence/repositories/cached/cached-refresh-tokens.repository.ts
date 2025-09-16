import type { RefreshTokensRepository } from '@/application/repositories/refresh-tokens.repository'
import { CachedRefreshTokensMapper } from '@/infra/persistence/mappers/cached/cached-refresh-tokens.mapper'
import type { RedisService } from '@/infra/providers/cache/redis-service'
import type { RefreshToken } from '@/domain/entities/refresh-token/refresh-token.entity'

export class CachedRefreshTokensRepository implements RefreshTokensRepository {
  private readonly keyPrefix = 'refresh-tokens'

  constructor (
    private readonly redis: RedisService,
    private readonly refreshTokensRepository: RefreshTokensRepository
  ) {}

  async save (refreshToken: RefreshToken): Promise<void> {
    await this.refreshTokensRepository.save(refreshToken)
    await this.cacheRefreshToken(refreshToken)
  }

  async findById (id: string): Promise<RefreshToken | null> {
    const cached = await this.redis.get(this.refreshTokenKey(id), CachedRefreshTokensMapper.toDomain)
    if (cached) return cached
    const refreshToken = await this.refreshTokensRepository.findById(id)
    if (refreshToken) {
      await this.cacheRefreshToken(refreshToken)
    }
    return refreshToken
  }

  async findByUserId (userId: string): Promise<RefreshToken | null> {
    const cachedId = await this.redis.get(this.refreshTokenUserKey(userId), (value) => value)
    if (cachedId) {
      const refreshToken = await this.findById(cachedId)
      if (refreshToken) return refreshToken
      await this.redis.delete(this.refreshTokenUserKey(userId))
    }
    const refreshToken = await this.refreshTokensRepository.findByUserId(userId)
    if (refreshToken) {
      await this.cacheRefreshToken(refreshToken)
    }
    return refreshToken
  }

  async deleteManyByUserId (userId: string): Promise<void> {
    await this.refreshTokensRepository.deleteManyByUserId(userId)
    await this.redis.delete(this.refreshTokenUserKey(userId))
  }

  private refreshTokenKey (id: string): string {
    return this.redis.entityKey(this.keyPrefix, id)
  }

  private refreshTokenUserKey (userId: string): string {
    return `${this.keyPrefix}:userId:${userId}`
  }

  private async cacheRefreshToken (refreshToken: RefreshToken): Promise<void> {
    await this.redis.set(this.refreshTokenKey(refreshToken.id), CachedRefreshTokensMapper.toPersistence(refreshToken))
    await this.redis.set(this.refreshTokenUserKey(refreshToken.userId), refreshToken.id)
  }
}
