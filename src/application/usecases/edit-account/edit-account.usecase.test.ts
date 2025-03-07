import type { UsersRepository } from '@/application/repositories/users.repository'
import {
  InMemoryUsersRepository,
} from '@/infra/persistence/repositories/in-memory/in-memory-users.repository'
import { PasswordHasherStub } from '@/infra/adapters/crypto/stubs/password-hasher.stub'
import { makeUser } from '@/util/factories/domain/make-user'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { EditAccountUseCase } from './edit-account.usecase'

describe('EditAccountUseCase', () => {
  let sut: EditAccountUseCase
  let usersRepository: UsersRepository
  let passwordHasherStub: PasswordHasherStub

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    passwordHasherStub = new PasswordHasherStub()
    sut = new EditAccountUseCase(usersRepository, passwordHasherStub)
  })

  it('should not edit a nonexistent user', async () => {
    await expect(sut.execute({
      userId: 'any_inexistent_id',
    })).rejects.toThrowError(new ResourceNotFoundError('User'))
  })

  it('should edit the user account name', async () => {
    const user = makeUser()
    await usersRepository.save(user)

    const response = await sut.execute({
      userId: user.id,
      name: 'new_name',
    })

    expect(response.id).toBe(user.id)
    expect(response.name).toBe('new_name')
    expect(response.email).toBe(user.email)
  })

  it('should edit the user account email', async () => {
    const user = makeUser()
    await usersRepository.save(user)

    const response = await sut.execute({
      userId: user.id,
      email: 'new_email',
    })

    expect(response.id).toBe(user.id)
    expect(response.email).toBe('new_email')
    expect(response.name).toBe(user.name)
  })

  it('should edit the user account password', async () => {
    const user = makeUser()
    await usersRepository.save(user)
    const newPassword = 'new_password'

    const response = await sut.execute({
      userId: user.id,
      password: newPassword,
    })

    const updatedUser = await usersRepository.findById(user.id)

    expect(response.id).toBe(user.id)
    expect(response.email).toBe(user.email)
    expect(response.name).toBe(user.name)
    expect(user.password).toBe('any_user_password')

    await expect(passwordHasherStub.compare(
      user.password,
      updatedUser?.password
    )).resolves.toBe(false)

    await expect(passwordHasherStub.compare(
      newPassword,
      updatedUser?.password
    )).resolves.toBe(true)
  })
})
