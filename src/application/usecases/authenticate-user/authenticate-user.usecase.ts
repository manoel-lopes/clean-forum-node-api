import type { UseCase } from '@/core/application/use-case'
import type { PasswordHasher } from '@/infra/adapters/crypto/ports/password-hasher'
import type { UsersRepository } from '@/application/repositories/users.repository'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import type { User } from '@/domain/entities/user/user.entity'
import { InvalidPasswordError } from './errors/invalid-password.error'

export type AuthenticateUserRequest = {
  email: string
  password: string
}
export type AuthenticateUserResponse = Omit<User, 'password'>
export class AuthenticateUserUseCase implements UseCase {
  constructor (
    private readonly usersRepository: UsersRepository,
    private readonly passwordHasher: PasswordHasher
  ) {}

  async execute (req: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    const { email, password } = req
    const user = await this.usersRepository.findByEmail(email)
    if (!user) {
      throw new ResourceNotFoundError('User')
    }
    const doesPasswordMatch = await this.passwordHasher.compare(password, user.password)
    if (!doesPasswordMatch) {
      throw new InvalidPasswordError()
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    }
  }
}
