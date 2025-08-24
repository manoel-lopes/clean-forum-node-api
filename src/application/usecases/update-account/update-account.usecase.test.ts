import type { UsersRepository } from '@/application/repositories/users.repository'
import { PasswordHasherStub } from '@/infra/adapters/security/stubs/password-hasher.stub'
import {
  InMemoryUsersRepository,
} from '@/infra/persistence/repositories/in-memory/in-memory-users.repository'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { makeUser } from '@/util/factories/domain/make-user'
import { UpdateAccountUseCase } from './update-account.usecase'

describe('UpdateAccountUseCase', () => {
  let sut: UpdateAccountUseCase
  let usersRepository: UsersRepository
  let passwordHasherStub: PasswordHasherStub

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    passwordHasherStub = new PasswordHasherStub()
    sut = new UpdateAccountUseCase(usersRepository, passwordHasherStub)
  })

  it('should not update a nonexistent user', async () => {
    await expect(sut.execute({
      userId: 'any_inexistent_id',
    })).rejects.toThrowError(new ResourceNotFoundError('User'))
  })

  it('should update the user account name', async () => {
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

  it('should update the user account email', async () => {
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

  it('should update the user account password', async () => {
    const user = makeUser()
    await usersRepository.save(user)
    const newPassword = 'new_password'

    const response = await sut.execute({
      userId: user.id,
      password: newPassword,
    })

    expect(response.id).toBe(user.id)
    expect(response.email).toBe(user.email)
    expect(response.name).toBe(user.name)
    const updatedUser = await usersRepository.findById(user.id)
    await expect(passwordHasherStub.compare(
      user.password,
      updatedUser?.password
    )).resolves.toBe(false)
    await expect(passwordHasherStub.compare(
      newPassword,
      updatedUser?.password
    )).resolves.toBe(true)
  })

  it('should update the user account name and email', async () => {
    const user = makeUser()
    await usersRepository.save(user)

    const response = await sut.execute({
      userId: user.id,
      name: 'new_name',
      email: 'new_email',
    })

    expect(response.id).toBe(user.id)
    expect(response.name).toBe('new_name')
    expect(response.email).toBe('new_email')
  })
})
