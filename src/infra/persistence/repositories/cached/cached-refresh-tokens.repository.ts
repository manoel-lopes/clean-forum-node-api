import type { RefreshTokensRepository } from '@/application/repositories/refresh-tokens.repository'
import { CachedRefreshTokensMapper } from '@/infra/persistence/mappers/cached/cached-refresh-tokens.mapper'
import type { RedisService } from '@/infra/providers/cache/redis-service'
import type { RefreshToken } from '@/domain/entities/refresh-token/refresh-token.entity'

export class CachedRefreshTokensRepository implements RefreshTokensRepository {
  constructor (
    private readonly redis: RedisService,
    private readonly refreshTokensRepository: RefreshTokensRepository
  ) {}

  async save (refreshToken: RefreshToken): Promise<void> {
    await this.refreshTokensRepository.save(refreshToken)
    await this.redis.set(this.entityKey(refreshToken.id), CachedRefreshTokensMapper.toPersistence(refreshToken))
    await this.redis.set(this.userKey(refreshToken.userId), CachedRefreshTokensMapper.toPersistence(refreshToken))
  }

  async findById (id: string): Promise<RefreshToken | null> {
    const cached = await this.redis.get(this.entityKey(id))
    if (cached) return CachedRefreshTokensMapper.toDomain(cached)
    const refreshToken = await this.refreshTokensRepository.findById(id)
    if (refreshToken) {
      await this.redis.set(this.entityKey(refreshToken.id), CachedRefreshTokensMapper.toPersistence(refreshToken))
      await this.redis.set(this.userKey(refreshToken.userId), CachedRefreshTokensMapper.toPersistence(refreshToken))
    }
    return refreshToken
  }

  async findByUserId (userId: string): Promise<RefreshToken | null> {
    const cached = await this.redis.get(this.userKey(userId))
    if (cached) return CachedRefreshTokensMapper.toDomain(cached)
    const refreshToken = await this.refreshTokensRepository.findByUserId(userId)
    if (refreshToken) {
      await this.redis.set(this.entityKey(refreshToken.id), CachedRefreshTokensMapper.toPersistence(refreshToken))
      await this.redis.set(this.userKey(refreshToken.userId), CachedRefreshTokensMapper.toPersistence(refreshToken))
    }
    return refreshToken
  }

  async deleteManyByUserId (userId: string): Promise<void> {
    await this.refreshTokensRepository.deleteManyByUserId(userId)
    await this.redis.delete(this.userKey(userId))
    await this.invalidateUserTokens(userId)
  }

  private entityKey (id: string) {
    return `refresh-tokens:${id}`
  }

  private userKey (userId: string) {
    return `refresh-tokens:userId:${userId}`
  }

  private async invalidateUserTokens (userId: string) {
    const pattern = `refresh-tokens:userId:${userId}*`
    const keys = await this.redis.keys(pattern)
    if (keys.length) {
      await this.redis.delete(...keys)
    }
  }
}
