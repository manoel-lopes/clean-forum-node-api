import { uuidv7 } from 'uuidv7'
import type { RefreshTokensRepository } from '@/domain/application/repositories/refresh-tokens.repository'
import { prisma } from '@/infra/persistence/prisma/client'
import type { RefreshToken, RefreshTokenProps } from '@/domain/enterprise/entities/refresh-token.entity'

export class PrismaRefreshTokensRepository implements RefreshTokensRepository {
  async save (refreshToken: RefreshTokenProps): Promise<RefreshToken> {
    const createdToken = await prisma.refreshToken.create({
      data: {
        id: uuidv7(),
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: refreshToken.userId,
        expiresAt: refreshToken.expiresAt
      }
    })
    return createdToken as RefreshToken
  }

  async findById (id: string): Promise<RefreshToken | null> {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: {
        id
      }
    })
    return refreshToken as RefreshToken | null
  }

  async findByUserId (userId: string): Promise<RefreshToken | null> {
    const refreshToken = await prisma.refreshToken.findFirst({
      where: {
        userId
      }
    })
    return refreshToken as RefreshToken | null
  }

  async deleteManyByUserId (userId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: {
        userId
      }
    })
  }
}
