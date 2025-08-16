import type { RefreshTokensRepository } from '@/application/repositories/refresh-tokens.repository'
import { prisma } from '@/infra/persistence/prisma/client'
import { RefreshToken } from '@/domain/entities/refresh-token/refresh-token.entity'

export class PrismaRefreshTokensRepository implements RefreshTokensRepository {
  async save (refreshToken: RefreshToken): Promise<void> {
    await prisma.refreshToken.create({
      data: {
        id: refreshToken.id,
        userId: refreshToken.userId,
        expiresAt: refreshToken.expiresAt
      }
    })
  }

  async findById (id: string): Promise<RefreshToken | null> {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: {
        id
      }
    })
    return refreshToken ? RefreshToken.create(refreshToken, refreshToken.id) : null
  }

  async findByUserId (userId: string): Promise<RefreshToken | null> {
    const refreshToken = await prisma.refreshToken.findFirst({
      where: {
        userId
      }
    })
    return refreshToken ? RefreshToken.create(refreshToken, refreshToken.id) : null
  }

  async deleteManyByUserId (userId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: {
        userId
      }
    })
  }
}
