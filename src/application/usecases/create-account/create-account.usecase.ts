import { UseCase } from '@core/application/use-case'
import { User } from '@domain/entities/user/user.entity'
import { UsersRepository } from '@application/repositories/users.repository'
import { PasswordHasher } from '@infra/adapters/crypto/ports/password-hasher'
import { UserWithEmailAlreadyRegisteredError } from './errors/user-with-email-already-registered.error'

interface CreateAccountRequest {
  name: string
  email: string
  password: string
}

interface CreateAccountResponse {
  user: User
}

export class CreateAccountUseCase implements UseCase<CreateAccountRequest, CreateAccountResponse> {
  constructor(
    private usersRepository: UsersRepository,
    private passwordHasher: PasswordHasher,
  ) {}

  public async execute({ name, email, password }: CreateAccountRequest): Promise<CreateAccountResponse> {
    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserWithEmailAlreadyRegisteredError()
    }

    const hashedPassword = await this.passwordHasher.hash(password)

    const user = User.create({
      name,
      email,
      password: hashedPassword,
    })

    await this.usersRepository.create(user)

    return {
      user,
    }
  }
}
