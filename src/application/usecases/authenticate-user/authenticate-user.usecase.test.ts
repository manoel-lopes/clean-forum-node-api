import { makeUser } from '@test/util/factories/domain/make-user'
import { InMemoryUsersRepository } from '@test/infra/persistence/repositories/in-memory/in-memory-users.repository'
import { PasswordHasherStub } from '@test/infra/adapters/crypto/stubs/password-hasher.stub'
import { AuthenticateUserUseCase } from './authenticate-user.usecase'
import { InvalidPasswordError } from './errors/invalid-password.error'

describe('AuthenticateUserUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let passwordHasher: PasswordHasherStub
  let sut: AuthenticateUserUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    passwordHasher = new PasswordHasherStub()
    sut = new AuthenticateUserUseCase(usersRepository, passwordHasher)
  })

  it('should be able to authenticate a user', async () => {
    const user = makeUser({ password: 'password' })
    await usersRepository.create(user)

    const result = await sut.execute({
      email: user.email,
      password: 'password',
    })

    expect(result.accessToken).toEqual('fake-access-token')
  })

  it('should not be able to authenticate a user with wrong email', async () => {
    const user = makeUser({ password: 'password' })
    await usersRepository.create(user)

    await expect(sut.execute({
      email: 'wrong-email',
      password: 'password',
    })).rejects.toBeInstanceOf(InvalidPasswordError)
  })

  it('should not be able to authenticate a user with wrong password', async () => {
    const user = makeUser({ password: 'password' })
    await usersRepository.create(user)

    await expect(sut.execute({
      email: user.email,
      password: 'wrong-password',
    })).rejects.toBeInstanceOf(InvalidPasswordError)
  })
})