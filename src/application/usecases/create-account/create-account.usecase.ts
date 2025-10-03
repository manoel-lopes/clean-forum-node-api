import type { UseCase } from '@/core/application/use-case'
import type { UsersRepository } from '@/application/repositories/users.repository'
import type { PasswordHasher } from '@/infra/adapters/security/ports/password-hasher'
import { User } from '@/domain/models/user/user.model'
import { UserWithEmailAlreadyRegisteredError } from './errors/user-with-email-already-registered.error'

export type CreateAccountRequest = Omit<User, 'id' | 'createdAt' | 'updatedAt'>

export class CreateAccountUseCase implements UseCase {
  constructor (
    private readonly usersRepository: UsersRepository,
    private readonly passwordHasher: PasswordHasher
  ) {}

  async execute (req: CreateAccountRequest): Promise<void> {
    const { name, email, password } = req
    const userAlreadyExists = await this.usersRepository.findByEmail(email)
    if (userAlreadyExists) {
      throw new UserWithEmailAlreadyRegisteredError()
    }
    const user = new User(name, email, password)
    const hashedPassword = await this.passwordHasher.hash(password)
    await this.usersRepository.save({
      id: user.id,
      name,
      email,
      password: hashedPassword,
      createdAt: user.createdAt
    })
  }
}
