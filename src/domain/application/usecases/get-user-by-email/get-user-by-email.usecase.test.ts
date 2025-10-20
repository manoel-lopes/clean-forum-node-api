import type { UsersRepository } from '@/domain/application/repositories/users.repository'
import { InMemoryUsersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-users.repository'
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

    const input = { email: 'johndoe@example.com' }

    const result = await sut.execute(input)

    expect(result.id).toBe(user.id)
    expect(result.name).toBe(user.name)
    expect(result.email).toBe(user.email)
  })

  it('should not be able to get a non-existing user by email', async () => {
    const input = { email: 'nonexistent@example.com' }

    await expect(sut.execute(input)).rejects.toThrow('User not found')
  })
})
