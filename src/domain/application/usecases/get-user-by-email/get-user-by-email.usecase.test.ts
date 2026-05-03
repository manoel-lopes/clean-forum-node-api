import { makeUserData } from 'tests/factories/domain/make-user'
import type { UsersRepository } from '@/domain/application/repositories/users.repository'
import { InMemoryUsersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-users.repository'
import { GetUserByEmailUseCase } from './get-user-by-email.usecase'

describe('GetUserByEmailUseCase', () => {
  let usersRepo: UsersRepository
  let sut: GetUserByEmailUseCase

  beforeEach(() => {
    usersRepo = new InMemoryUsersRepository()
    sut = new GetUserByEmailUseCase(usersRepo)
  })

  it('should be able to get a user by email', async () => {
    const user = await usersRepo.create(makeUserData({
      email: 'johndoe@example.com',
    }))

    const request = { email: 'johndoe@example.com' }

    const response = await sut.execute(request)

    expect(response.id).toBe(user.id)
    expect(response.name).toBe(user.name)
    expect(response.email).toBe(user.email)
  })

  it('should not be able to get a non-existing user by email', async () => {
    const request = { email: 'nonexistent@example.com' }

    await expect(sut.execute(request)).rejects.toThrow('User not found')
  })
})
