import type { UseCase } from '@/core/application/use-case'
import type { UsersRepository } from '@/application/repositories/users.repository'
import { User } from '@/domain/entities/user/user.entity'
import type { UserProps } from '@/domain/entities/user/ports/user.props'
import type { PasswordHasher } from '@/infra/adapters/crypto/ports/password-hasher'
import {
  UserWithEmailAlreadyRegisteredError,
} from './errors/user-with-email-already-registered.error'

export type CreateAccountRequest = UserProps

export type CreateAccountResponse = Omit<User, 'password'>

export class CreateAccountUseCase implements UseCase {
  constructor (
    private readonly usersRepository: UsersRepository,
    private readonly passwordHasher: PasswordHasher
  ) {
    Object.freeze(this)
  }

  async execute (req: CreateAccountRequest): Promise<CreateAccountResponse> {
    const { name, email, password } = req
    const user = User.create({ name, email, password })
    const userAlreadyExists = await this.usersRepository.findByEmail(email)
    if (userAlreadyExists) {
      throw new UserWithEmailAlreadyRegisteredError()
    }
    const hashedPassword = await this.passwordHasher.hash(password)
    await this.usersRepository.save({
      id: user.id,
      name,
      email,
      password: hashedPassword,
      createdAt: user.createdAt
    })
    return user
  }
}
