import { RefreshToken } from '@/domain/entities/refresh-token/refresh-token.entity'

export interface RefreshTokensRepository {
  save(refreshToken: RefreshToken): Promise<void>
  findById(id: string): Promise<RefreshToken | null>
  findByUserId(userId: string): Promise<RefreshToken | null>
  deleteManyByUserId(userId: string): Promise<void>
}
