import type { PaginatedItems } from '@/core/application/paginated-items'
import type { PaginationParams } from '@/core/application/pagination-params'
import type { UsersRepository } from '@/application/repositories/users.repository'
import type { User } from '@/domain/entities/user/user.entity'
import { BaseInMemoryRepository as BaseRepository } from './base/base-in-memory.repository'

export class InMemoryUsersRepository extends BaseRepository<User> implements UsersRepository {
  async findByEmail (email: string): Promise<User | null> {
    const user = await this.findOneBy('email', email)
    return user
  }

  async findMany ({ page = 1, pageSize: requestedPageSize = 20 }: PaginationParams): Promise<PaginatedItems<User>> {
    const start = (page - 1) * requestedPageSize
    const end = start + requestedPageSize
    const users = this.items.slice(start, end)
    const totalItems = this.items.length
    const totalPages = Math.ceil(totalItems / requestedPageSize)
    const actualPageSize = Math.min(requestedPageSize, totalItems)
    return {
      page,
      pageSize: actualPageSize,
      totalItems,
      totalPages,
      items: users
    }
  }
}
