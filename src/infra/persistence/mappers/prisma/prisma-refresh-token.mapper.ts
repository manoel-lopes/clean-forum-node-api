import { RefreshToken } from '@/domain/entities/refresh-token/refresh-token.entity'
import { type RefreshToken as PrismaRefreshToken } from '@prisma/client'

export abstract class PrismaRefreshTokenMapper {
  static toDomain (raw: PrismaRefreshToken): RefreshToken {
    return RefreshToken.create(
      {
        userId: raw.userId,
        expiresAt: raw.expiresAt,
        createdAt: raw.createdAt,
      },
      raw.id
    )
  }

  static toPrisma (refreshToken: RefreshToken): PrismaRefreshToken {
    return {
      id: refreshToken.id,
      userId: refreshToken.userId,
      expiresAt: refreshToken.expiresAt,
      createdAt: refreshToken.createdAt,
    }
  }
}
