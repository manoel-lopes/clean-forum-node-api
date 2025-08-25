import type { PaginatedItems } from '@/core/application/paginated-items'
import type { PaginationParams } from '@/core/application/pagination-params'
import type { User } from '@/domain/entities/user/user.entity'

export type UpdateUserData = {
  where: { id: string }
  data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>
}

export type PaginatedUsers = Required<PaginatedItems<User>>

export type UsersRepository = {
  save: (user: User) => Promise<void>
  update: (user: UpdateUserData) => Promise<User>
  findById(userId: string): Promise<User | null>
  delete(userId: string): Promise<void>
  findByEmail(email: string): Promise<User | null>
  findMany(paginationParams: PaginationParams): Promise<PaginatedUsers>
}
