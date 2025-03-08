import type { UseCase } from '@/core/application/use-case'
import type { UsersRepository } from '@/application/repositories/users.repository'
import type { PasswordHasher } from '@/infra/adapters/crypto/ports/password-hasher'
import type { User } from '@/infra/persistence/typeorm/data-mappers/user/user.mapper'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import type { EditAccountRequest } from './ports/edit-account.request'

export class EditAccountUseCase implements UseCase {
  constructor (
    private readonly usersRepository: UsersRepository,
    private readonly passwordHasher: PasswordHasher
  ) {
    Object.freeze(this)
  }

  async execute (req: EditAccountRequest): Promise<User> {
    const { userId, name, email, password } = req
    const user = await this.usersRepository.findById(userId)
    if (!user) {
      throw new ResourceNotFoundError('User')
    }

    const editedUser = await this.usersRepository.update({
      id: userId,
      name,
      email,
      password: password && await this.passwordHasher.hash(password),
    })
    return editedUser
  }
}
