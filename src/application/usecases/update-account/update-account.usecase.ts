import type { UseCase } from '@/core/application/use-case'
import type { UpdateUserData, UsersRepository } from '@/application/repositories/users.repository'
import type { PasswordHasher } from '@/infra/adapters/security/ports/password-hasher'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import type { User } from '@/domain/entities/user/user.entity'

export type UpdateAccountRequest = UpdateUserData['data'] & {
  userId: string
}

export class UpdateAccountUseCase implements UseCase {
  constructor (
    private readonly usersRepository: UsersRepository,
    private readonly passwordHasher: PasswordHasher
  ) {
    Object.freeze(this)
  }

  async execute (req: UpdateAccountRequest): Promise<User> {
    const { userId, name, email, password } = req
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      throw new ResourceNotFoundError('User')
    }

    const updatedUser = await this.usersRepository.update({
      where: { id: userId },
      data: {
        name,
        email,
        password: password && await this.passwordHasher.hash(password),
      },
    })
    return updatedUser
  }
}
