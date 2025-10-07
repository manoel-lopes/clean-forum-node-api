import { uuidv7 } from 'uuidv7'
import type { PaginatedItems } from '@/core/domain/application/paginated-items'
import type { PaginationParams } from '@/core/domain/application/pagination-params'
import type { UpdateUserData, UsersRepository } from '@/domain/application/repositories/users.repository'
import { prisma } from '@/infra/persistence/prisma/client'
import type { User, UserProps } from '@/domain/enterprise/entities/user.entity'

export class PrismaUsersRepository implements UsersRepository {
  async save (user: UserProps): Promise<void> {
    await prisma.user.create({
      data: {
        id: uuidv7(),
        createdAt: new Date(),
        updatedAt: new Date(),
        ...user
      }
    })
  }

  async update (user: UpdateUserData): Promise<User> {
    const updatedUser = await prisma.user.update({
      where: { id: user.where.id },
      data: user.data,
    })
    return updatedUser as User
  }

  async findById (userId: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })
    return user as User | null
  }

  async delete (userId: string): Promise<void> {
    await prisma.user.delete({
      where: { id: userId },
    })
  }

  async findByEmail (email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    })
    return user as User | null
  }

  async findMany ({ page = 1, pageSize = 10, order = 'desc' }: PaginationParams): Promise<PaginatedItems<User>> {
    const [users, totalItems] = await prisma.$transaction([
      prisma.user.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: order }
      }),
      prisma.user.count()
    ])
    const totalPages = Math.ceil(totalItems / pageSize)
    return {
      page,
      pageSize,
      totalItems,
      totalPages,
      items: users as User[],
      order
    }
  }
}
