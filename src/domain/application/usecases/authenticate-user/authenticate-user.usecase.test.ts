import type { UsersRepository } from '@/domain/application/repositories/users.repository'
import { PasswordHasherStub } from '@/infra/adapters/security/stubs/password-hasher.stub'
import { InMemoryRefreshTokensRepository } from '@/infra/persistence/repositories/in-memory/in-memory-refresh-tokens.repository'
import { InMemoryUsersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-users.repository'
import type { PasswordHasher } from '@/infra/adapters/security/ports/password-hasher'
import { makeUser } from '@/shared/util/factories/domain/make-user'
import { expectToThrowResourceNotFound } from '@/shared/util/test/test-helpers'
import { AuthenticateUserUseCase } from './authenticate-user.usecase'

vi.mock('@/lib/env', () => ({
  env: {
    NODE_ENV: 'development',
    JWT_SECRET: 'any_secret',
    REFRESH_TOKEN_SECRET: 'any_refresh_secret'
  }
}))

describe('AuthenticateUserUseCase', () => {
  let usersRepository: UsersRepository
  let passwordHasherStub: PasswordHasher
  let refreshTokensRepository: InMemoryRefreshTokensRepository
  let sut: AuthenticateUserUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    passwordHasherStub = new PasswordHasherStub()
    refreshTokensRepository = new InMemoryRefreshTokensRepository()
    sut = new AuthenticateUserUseCase(usersRepository, passwordHasherStub, refreshTokensRepository)
  })

  it('should not authenticate a inexistent user', async () => {
    const input = {
      email: 'nonexistent@example.com',
      password: 'any-password'
    }

    await expectToThrowResourceNotFound(
      async () => sut.execute(input),
      'User'
    )
  })

  it('should not authenticate a user passing the wrong password', async () => {
    const user = makeUser({ email: 'user@example.com' })
    await usersRepository.create({
      ...user,
      password: await passwordHasherStub.hash('correct-password')
    })

    const input = {
      email: user.email,
      password: 'wrong-password'
    }

    await expect(sut.execute(input)).rejects.toThrow('Invalid password')
  })

  it('should authenticate the user', async () => {
    const password = 'user-password'
    const user = makeUser({ email: 'user@example.com' })
    await usersRepository.create({
      ...user,
      password: await passwordHasherStub.hash(password)
    })

    const input = {
      email: user.email,
      password
    }

    const result = await sut.execute(input)

    expect(result.token).toBeDefined()
    const sevenDaysFromNow = new Date()
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
    const refreshToken = await refreshTokensRepository.findByUserId(user.id)
    if (refreshToken) {
      expect(refreshToken.userId).toEqual(user.id)
      expect(refreshToken.expiresAt.getDate()).toEqual(sevenDaysFromNow.getDate())
    }
  })
})
