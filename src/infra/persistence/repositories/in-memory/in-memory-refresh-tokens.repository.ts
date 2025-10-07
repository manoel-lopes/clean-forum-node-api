import { uuidv7 } from 'uuidv7'
import type { RefreshTokensRepository } from '@/domain/application/repositories/refresh-tokens.repository'
import type { RefreshToken, RefreshTokenProps } from '@/domain/enterprise/entities/refresh-token.entity'
import { BaseInMemoryRepository as BaseRepository } from './base/base-in-memory.repository'

export class InMemoryRefreshTokensRepository extends BaseRepository<RefreshToken> implements RefreshTokensRepository {
  async save (data: RefreshTokenProps): Promise<RefreshToken> {
    const refreshToken: RefreshToken = {
      id: uuidv7(),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data
    }
    this.items.push(refreshToken)
    return refreshToken
  }

  async findByUserId (userId: string): Promise<RefreshToken | null> {
    return this.findOneBy('userId', userId)
  }

  async deleteManyByUserId (userId: string): Promise<void> {
    this.items = this.items.filter(item => item.userId !== userId)
  }
}
