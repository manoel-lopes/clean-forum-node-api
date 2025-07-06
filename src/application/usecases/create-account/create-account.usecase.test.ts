import { PasswordHasherStub } from '@/infra/adapters/crypto/stubs/password-hasher.stub'
import { InMemoryUsersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-users.repository'

import type { UsersRepository } from '@/application/repositories/users.repository'

import { CreateAccountUseCase } from './create-account.usecase'
import { UserWithEmailAlreadyRegisteredError } from './errors/user-with-email-already-registered.error'

describe('CreateAccountUseCase', () => {
  let sut: CreateAccountUseCase
  let usersRepository: UsersRepository
  let passwordHasherStub: PasswordHasherStub

  const request = {
    name: 'any_user_name',
    email: 'any_user_email',
    password: 'any_user_password'
  }

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    passwordHasherStub = new PasswordHasherStub()
    sut = new CreateAccountUseCase(usersRepository, passwordHasherStub)
  })

  it('should not create a user account if the email is already registered', async () => {
    await sut.execute(request)

    await expect(sut.execute(request)).rejects.toThrowError(new UserWithEmailAlreadyRegisteredError())
  })

  it('should correctly create a user account', async () => {
    const user = await sut.execute(request)

    expect(user.id).toBeDefined()
    expect(user.name).toBe('any_user_name')
    expect(user.email).toBe('any_user_email')
    expect(user.createdAt).toBeInstanceOf(Date)
  })

  it('should hash the user password', async () => {
    const hashSpy = vi.spyOn(passwordHasherStub, 'hash')

    await sut.execute(request)

    expect(hashSpy).toHaveBeenCalledWith(request.password)
  })

  it('should persist the user with the hashed password', async () => {
    const createSpy = vi.spyOn(usersRepository, 'save')

    await sut.execute(request)

    expect(createSpy).toHaveBeenCalledWith(expect.objectContaining({
      password: 'hashed_any_user_password' // This comes from the PasswordHasherStub
    }))
  })
})
