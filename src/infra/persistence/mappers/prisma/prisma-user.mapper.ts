import type { User } from '@/domain/enterprise/entities/user.entity'
import type { User as PrismaUser } from '@prisma/client'

export class PrismaUserMapper {
  static toDomain (raw: PrismaUser): User {
    const user: User = {
      id: raw.id,
      name: raw.name,
      email: raw.email,
      password: raw.password,
      createdAt: raw.createdAt,
    }
    if (raw.updatedAt) user.updatedAt = raw.updatedAt
    return user
  }
}
