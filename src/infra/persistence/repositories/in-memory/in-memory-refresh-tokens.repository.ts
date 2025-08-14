import type { RefreshTokensRepository } from '@/application/repositories/refresh-tokens.repository'
import { RefreshToken } from '@/domain/entities/refresh-token/refresh-token.entity'

export class InMemoryRefreshTokensRepository implements RefreshTokensRepository {
  public items: RefreshToken[] = []

  async save (refreshToken: RefreshToken): Promise<void> {
    this.items.push(refreshToken)
  }

  async findById (id: string): Promise<RefreshToken | null> {
    const refreshToken = this.items.find(item => item.id === id)
    return refreshToken || null
  }

  async delete (id: string): Promise<void> {
    this.items = this.items.filter(item => item.id !== id)
  }

  async deleteManyByUserId (userId: string): Promise<void> {
    this.items = this.items.filter(item => item.userId !== userId)
  }

  async revoke (id: string): Promise<void> {
    this.items = this.items.filter(item => item.id !== id)
  }
}
