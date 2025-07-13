import type { PaginatedItems } from '@/core/application/paginated-items'
import type { PaginationParams } from '@/core/application/pagination-params'
import type { User } from '@/domain/entities/user/user.entity'

export type UsersRepository = {
  save: (user: User) => Promise<void>
  findById(userId: string): Promise<User | null>
  delete(userId: string): Promise<void>
  findByEmail(email: string): Promise<User | null>
  findMany(paginationParams: PaginationParams): Promise<PaginatedItems<User>>
}
