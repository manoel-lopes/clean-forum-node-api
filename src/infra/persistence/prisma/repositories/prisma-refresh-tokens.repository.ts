import type { RefreshTokensRepository } from '@/application/repositories/refresh-tokens.repository'
import { RefreshToken } from '@/domain/entities/refresh-token/refresh-token.entity'
import { prisma } from '../client'

export class PrismaRefreshTokensRepository implements RefreshTokensRepository {
  async save (refreshToken: RefreshToken): Promise<void> {
    await prisma.refreshToken.create({
      data: {
        id: refreshToken.id,
        userId: refreshToken.userId,
        expiresAt: refreshToken.expiresAt,
        createdAt: refreshToken.createdAt
      }
    })
  }

  async findById (id: string): Promise<RefreshToken | null> {
    const raw = await prisma.refreshToken.findUnique({
      where: {
        id
      }
    })

    if (!raw) {
      return null
    }

    return {
      id: raw.id,
      userId: raw.userId,
      expiresAt: raw.expiresAt,
      createdAt: raw.createdAt,
    }
  }

  async deleteManyByUserId (userId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: {
        userId
      }
    })
  }
}
