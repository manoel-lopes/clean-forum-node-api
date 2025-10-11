import type { UsersRepository } from '@/domain/application/repositories/users.repository'
import { InMemoryUsersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-users.repository'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { makeUser } from '@/shared/util/factories/domain/make-user'
import { GetUserByEmailUseCase } from './get-user-by-email.usecase'

describe('GetUserByEmailUseCase', () => {
  let usersRepository: UsersRepository
  let sut: GetUserByEmailUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserByEmailUseCase(usersRepository)
  })

  it('should be able to get a user by email', async () => {
    const user = makeUser({ email: 'johndoe@example.com' })
    await usersRepository.create(user)

    const response = await sut.execute({ email: 'johndoe@example.com' })

    expect(response.id).toEqual(user.id)
    expect(response.name).toEqual(user.name)
    expect(response.email).toEqual(user.email)
    expect(response.createdAt).toEqual(user.createdAt)
  })

  it('should not be able to get a non-existing user by email', async () => {
    await expect(
      sut.execute({ email: 'nonexistent@example.com' })
    ).rejects.toThrow(new ResourceNotFoundError('User'))
  })
})
