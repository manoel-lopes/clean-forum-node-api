import { makeUser } from '@test/util/factories/domain/make-user'
import { InMemoryUsersRepository } from '@test/infra/persistence/repositories/in-memory/in-memory-users.repository'
import { PasswordHasherStub } from '@test/infra/adapters/crypto/stubs/password-hasher.stub'
import { CreateAccountUseCase } from './create-account.usecase'
import { UserWithEmailAlreadyRegisteredError } from './errors/user-with-email-already-registered.error'

describe('CreateAccountUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let passwordHasher: PasswordHasherStub
  let sut: CreateAccountUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    passwordHasher = new PasswordHasherStub()
    sut = new CreateAccountUseCase(usersRepository, passwordHasher)
  })

  it('should be able to create a new account', async () => {
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password',
    })

    expect(user.id).toEqual(expect.any(String))
    expect(usersRepository.items[0].id).toEqual(user.id)
    expect(usersRepository.items[0].password).toEqual('password-hashed')
  })

  it('should not be able to create a new account with same email', async () => {
    const user = makeUser({ email: 'john.doe@example.com' })
    await usersRepository.create(user)

    await expect(sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password',
    })).rejects.toBeInstanceOf(UserWithEmailAlreadyRegisteredError)
  })
})