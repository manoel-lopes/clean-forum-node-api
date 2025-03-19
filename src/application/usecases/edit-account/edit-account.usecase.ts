import type { UseCase } from '@/core/application/use-case'
import type { UsersRepository, UpdateUserData } from '@/application/repositories/users.repository'
import type { PasswordHasher } from '@/infra/adapters/crypto/ports/password-hasher'
import type { User } from '@/domain/entities/user/user.entity'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import type { Rename } from '@/util/types/rename'

export type EditAccountRequest = Rename<UpdateUserData, 'id', 'userId'>

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
