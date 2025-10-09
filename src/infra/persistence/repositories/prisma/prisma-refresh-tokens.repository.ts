import type { RefreshTokensRepository } from '@/domain/application/repositories/refresh-tokens.repository'
import { prisma } from '@/infra/persistence/prisma/client'
import type { RefreshToken, RefreshTokenProps } from '@/domain/enterprise/entities/refresh-token.entity'

export class PrismaRefreshTokensRepository implements RefreshTokensRepository {
  async create (data: RefreshTokenProps): Promise<RefreshToken> {
    const refreshToken = await prisma.refreshToken.create({ data })
    return refreshToken
  }

  async findById (refreshTokenId: string): Promise<RefreshToken | null> {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { id: refreshTokenId }
    })
    return refreshToken
  }

  async findByUserId (userId: string): Promise<RefreshToken | null> {
    const refreshToken = await prisma.refreshToken.findFirst({
      where: { userId }
    })
    return refreshToken
  }

  async deleteManyByUserId (userId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { userId }
    })
  }
}
