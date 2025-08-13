import type { UseCase } from '@/core/application/use-case'
import type { UsersRepository } from '@/application/repositories/users.repository'
import { JWTService } from '@/infra/jwt-service'
import type { PasswordHasher } from '@/infra/adapters/security/ports/password-hasher'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { InvalidPasswordError } from './errors/invalid-password.error'

export type AuthenticateUserRequest = {
  email: string
  password: string
}

export type AuthenticateUserResponse = {
  token: string
}

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

    const token = JWTService.sign(user.id)
    return { token }
  }
}
