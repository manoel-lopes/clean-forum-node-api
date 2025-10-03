import { User } from '@/domain/models/user/user.model'
import { type User as PrismaUser } from '@prisma/client'

export abstract class PrismaUserMapper {
  static toDomain (raw: PrismaUser): User {
    const user = new User(raw.name, raw.email, raw.password, raw.id)
    Object.assign(user, {
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt
    })
    return user
  }

  static toPrisma (user: User): PrismaUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt ?? new Date(),
    }
  }
}
