import type { PaginatedItems } from '@/core/application/paginated-items'
import type { PaginationParams } from '@/core/application/pagination-params'
import type { UseCase } from '@/core/application/use-case'

import type { UsersRepository } from '@/application/repositories/users.repository'

import type { User } from '@/domain/entities/user/user.entity'

export class FetchUsersUseCase implements UseCase {
  constructor (private readonly usersRepository: UsersRepository) {}

  async execute (paginationParams: PaginationParams): Promise<PaginatedItems<User>> {
    const users = await this.usersRepository.findMany(paginationParams)
    return users
  }
}
