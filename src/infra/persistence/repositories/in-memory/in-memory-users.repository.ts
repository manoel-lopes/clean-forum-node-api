import type { PaginatedItems } from '@/core/application/paginated-items'
import type { PaginationParams } from '@/core/application/pagination-params'
import type { UpdateUserData, UsersRepository } from '@/application/repositories/users.repository'
import type { User } from '@/domain/entities/user/user.entity'
import { BaseInMemoryRepository as BaseRepository } from './base/base-in-memory.repository'

export class InMemoryUsersRepository extends BaseRepository<User> implements UsersRepository {
  async update (user: UpdateUserData): Promise<User> {
    const updatedUser = await this.updateOne({ id: user.where.id, ...user.data })
    return updatedUser
  }

  async findByEmail (email: string): Promise<User | null> {
    const user = await this.findOneBy('email', email)
    return user
  }

  async findMany ({
    page = 1,
    pageSize = 20,
    order = 'desc'
  }: PaginationParams): Promise<PaginatedItems<User>> {
    const users = this.items
      .sort((a, b) => {
        if (order === 'asc') {
          return a.createdAt.getTime() - b.createdAt.getTime()
        }
        return b.createdAt.getTime() - a.createdAt.getTime()
      })
      .slice((page - 1) * pageSize, page * pageSize)
    const totalItems = this.items.length
    const totalPages = Math.ceil(totalItems / pageSize)
    return {
      page,
      pageSize: Math.min(pageSize, totalItems),
      totalItems,
      totalPages,
      items: users,
      order
    }
  }
}
