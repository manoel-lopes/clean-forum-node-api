import { User } from '@/domain/entities/user/user.entity'

import { type User as PrismaUser } from '@prisma/client'

export abstract class PrismaUserMapper {
  static toDomain (raw: PrismaUser): User {
    return User.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
      },
      raw.id
    )
  }

  static toPrisma (user: User): PrismaUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt ?? user.createdAt,
    }
  }
}
