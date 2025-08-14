import type { UsersRepository } from '@/application/repositories/users.repository'
import { PasswordHasherStub } from '@/infra/doubles/stubs/password-hasher.stub'
import { InMemoryRefreshTokensRepository } from '@/infra/persistence/repositories/in-memory/in-memory-refresh-tokens.repository'
import { InMemoryUsersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-users.repository'
import type { PasswordHasher } from '@/infra/adapters/security/ports/password-hasher'
import { makeUser } from '@/util/factories/domain/make-user'
import { AuthenticateUserUseCase } from './authenticate-user.usecase'

describe('AuthenticateUserUseCase', () => {
  let usersRepository: UsersRepository
  let passwordHasherStub: PasswordHasher
  let sut: AuthenticateUserUseCase
  const request = {
    email: 'any_email',
    password: 'any_password'
  }

  vi.mock('@/lib/env', () => ({
    env: {
      NODE_ENV: 'development',
      JWT_SECRET: 'any_secret',
      REFRESH_TOKEN_SECRET: 'any_refresh_secret'
    }
  }))

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    passwordHasherStub = new PasswordHasherStub()
    const refreshTokensRepository = new InMemoryRefreshTokensRepository()
    sut = new AuthenticateUserUseCase(usersRepository, passwordHasherStub, refreshTokensRepository)
  })

  it('should not authenticate a inexistent user', async () => {
    await expect(sut.execute(request)).rejects.toThrow('User not found')
  })

  it('should not authenticate a user passing the wrong password', async () => {
    const user = makeUser()
    await usersRepository.save({
      ...user,
      password: await passwordHasherStub.hash('right_password')
    })

    await expect(sut.execute({
      email: user.email,
      password: 'wrong_password'
    })).rejects.toThrow('Invalid password')
  })

  it('should authenticate the user', async () => {
    const user = makeUser({ email: request.email })
    await usersRepository.save({
      ...user,
      password: await passwordHasherStub.hash(request.password)
    })

    const response = await sut.execute(request)

    expect(response.token).toBeDefined()
  })
})
