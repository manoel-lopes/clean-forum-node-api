import type { PaginatedItems } from '@/core/domain/application/paginated-items'
import type { PaginationParams } from '@/core/domain/application/pagination-params'
import type { UpdateUserData, UsersRepository } from '@/domain/application/repositories/users.repository'
import { prisma } from '@/infra/persistence/prisma/client'
import { BasePrismaRepository } from '@/infra/persistence/repositories/prisma/base/base-prisma.repository'
import type { User, UserProps } from '@/domain/enterprise/entities/user.entity'

export class PrismaUsersRepository extends BasePrismaRepository implements UsersRepository {
  async create (data: UserProps): Promise<User> {
    const user = await prisma.user.create({ data })
    return user
  }

  async update ({ where, data }: UpdateUserData): Promise<User> {
    const updatedUser = await prisma.user.update({ where, data })
    return updatedUser
  }

  async findById (userId: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id: userId },
    })
  }

  async delete (userId: string): Promise<void> {
    await prisma.user.delete({
      where: { id: userId },
    })
  }

  async findByEmail (userEmail: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email: userEmail },
    })
  }

  async findMany ({ page = 1, pageSize = 10, order = 'desc' }: PaginationParams): Promise<PaginatedItems<User>> {
    const pagination = this.sanitizePagination(page, pageSize)
    const [users, totalItems] = await prisma.$transaction([
      prisma.user.findMany({
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: order },
      }),
      prisma.user.count(),
    ])
    return {
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalItems,
      totalPages: this.calculateTotalPages(totalItems, pagination.pageSize),
      items: users,
      order,
    }
  }
}
