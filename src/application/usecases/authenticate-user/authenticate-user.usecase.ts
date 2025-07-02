import { UseCase } from '@core/application/use-case'
import { UsersRepository } from '@application/repositories/users.repository'
import { PasswordHasher } from '@infra/adapters/crypto/ports/password-hasher'
import { InvalidPasswordError } from './errors/invalid-password.error'

interface AuthenticateUserRequest {
  email: string
  password: string
}

interface AuthenticateUserResponse {
  accessToken: string
}

export class AuthenticateUserUseCase implements UseCase<AuthenticateUserRequest, AuthenticateUserResponse> {
  constructor(
    private usersRepository: UsersRepository,
    private passwordHasher: PasswordHasher,
  ) {}

  public async execute({ email, password }: AuthenticateUserRequest): Promise<AuthenticateUserResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) {
      throw new InvalidPasswordError()
    }

    const passwordMatches = await this.passwordHasher.compare(password, user.password)

    if (!passwordMatches) {
      throw new InvalidPasswordError()
    }

    return {
      accessToken: 'fake-access-token',
    }
  }
}