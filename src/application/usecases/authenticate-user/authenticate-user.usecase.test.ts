import type { UsersRepository } from '@/application/repositories/users.repository'
import type { PasswordHasher } from '@/infra/adapters/crypto/ports/password-hasher'
import {
  InMemoryUsersRepository,
} from '@/infra/persistence/repositories/in-memory/in-memory-users.repository'
import { PasswordHasherStub } from '@/infra/adapters/crypto/stubs/password-hasher.stub'
import { makeUser } from '@/util/factories/domain/make-user'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { InvalidPasswordError } from './errors/invalid-password.error'
import { AuthenticateUserUseCase } from './authenticate-user.usecase'

describe('AuthenticateUserUseCase', () => {
  let sut: AuthenticateUserUseCase
  let usersRepository: UsersRepository
  let passwordHasherStub: PasswordHasher

  const request = {
    email: 'any_email',
    password: 'any_password',
  }

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    passwordHasherStub = new PasswordHasherStub()
    sut = new AuthenticateUserUseCase(usersRepository, passwordHasherStub)
  })

  it('should not authenticate an inexistent user', async () => {
    await expect(sut.execute(request))
      .rejects
      .toThrow(new ResourceNotFoundError('User'))
  })

  it('should not authenticate a user with the wrong password', async () => {
    const user = makeUser()
    await usersRepository.save({
      ...user,
      password: await passwordHasherStub.hash('right_password'),
    })

    await expect(sut.execute({
      email: user.email,
      password: 'wrong_password',
    })).rejects.toThrow(new InvalidPasswordError())
  })

  it('should authenticate the user', async () => {
    const user = makeUser()
    const hashedPassword = await passwordHasherStub.hash(request.password)
    await usersRepository.save({
      ...user,
      email: request.email,
      password: hashedPassword,
    })

    const response = await sut.execute(request)

    expect(response.id).toBeDefined()
    expect(response.name).toBe(user.name)
    expect(response.email).toBe(request.email)
  })
})
