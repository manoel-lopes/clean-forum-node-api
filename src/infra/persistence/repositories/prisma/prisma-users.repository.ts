import type { PaginatedItems } from '@/core/application/paginated-items'
import type { PaginationParams } from '@/core/application/pagination-params'
import { PrismaUserMapper } from '@/infra/persistence/mappers/prisma/prisma-user.mapper'
import { prisma } from '@/infra/persistence/prisma/client'
import type { UsersRepository } from '@/application/repositories/users.repository'
import type { User } from '@/domain/entities/user/user.entity'

export class PrismaUsersRepository implements UsersRepository {
  async save (user: User): Promise<void> {
    const data = PrismaUserMapper.toPrisma(user)
    await prisma.user.create({ data })
  }

  async findById (userId: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })
    return !user ? null : PrismaUserMapper.toDomain(user)
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
    return !user ? null : PrismaUserMapper.toDomain(user)
  }

  async findMany ({ page, pageSize: requestedPageSize }: PaginationParams): Promise<PaginatedItems<User>> {
    const [users, totalItems] = await prisma.$transaction([
      prisma.user.findMany({
        skip: (page - 1) * requestedPageSize,
        take: requestedPageSize,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count()
    ])
    const totalPages = Math.ceil(totalItems / requestedPageSize)
    const actualPageSize = Math.min(requestedPageSize, totalItems)
    return {
      page,
      pageSize: actualPageSize,
      totalItems,
      totalPages,
      items: users.map(PrismaUserMapper.toDomain)
    }
  }
}
