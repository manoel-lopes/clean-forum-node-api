import type { UseCase } from '@/core/application/use-case'

import type { UsersRepository } from '@/application/repositories/users.repository'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'

import type { User } from '@/domain/entities/user/user.entity'

type GetUserByEmailUseCaseRequest = {
  email: string
}

type GetUserByEmailUseCaseResponse = Omit<User, 'password'>

export class GetUserByEmailUseCase implements UseCase {
  constructor (private readonly usersRepository: UsersRepository) {}

  async execute ({
    email,
  }: GetUserByEmailUseCaseRequest): Promise<GetUserByEmailUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new ResourceNotFoundError('User')
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    }
  }
}
