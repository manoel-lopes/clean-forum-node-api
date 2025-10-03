import type { UseCase } from '@/core/application/use-case'
import type { RefreshTokensRepository } from '@/application/repositories/refresh-tokens.repository'
import type { UsersRepository } from '@/application/repositories/users.repository'
import { JWTService } from '@/infra/auth/jwt/jwt-service'
import type { PasswordHasher } from '@/infra/adapters/security/ports/password-hasher'
import { RefreshToken } from '@/domain/entities/refresh-token/refresh-token.entity'
import { InvalidPasswordError } from './errors/invalid-password.error'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'

export type AuthenticateUserRequest = {
  email: string
  password: string
}

export type AuthenticateUserResponse = {
  token: string
  refreshToken: RefreshToken
}

export class AuthenticateUserUseCase implements UseCase {
  constructor (
    private readonly usersRepository: UsersRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly refreshTokensRepository: RefreshTokensRepository
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
    const refreshToken = RefreshToken.create({ userId: user.id })
    await this.refreshTokensRepository.save(refreshToken)
    return { token, refreshToken }
  }
}
