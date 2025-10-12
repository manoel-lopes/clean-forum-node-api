import type { UsersRepository } from '@/domain/application/repositories/users.repository'
import { InMemoryUsersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-users.repository'
import { makeUser } from '@/shared/util/factories/domain/make-user'
import { createAndSave, expectToThrowResourceNotFound, expectEntityToMatch } from '@/shared/util/test/test-helpers'
import { GetUserByEmailUseCase } from './get-user-by-email.usecase'

describe('GetUserByEmailUseCase', () => {
  let usersRepository: UsersRepository
  let sut: GetUserByEmailUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserByEmailUseCase(usersRepository)
  })

  it('should be able to get a user by email', async () => {
    const user = await createAndSave(
      makeUser,
      usersRepository,
      { email: 'johndoe@example.com' }
    )
    const input = { email: 'johndoe@example.com' }

    const result = await sut.execute(input)

    expectEntityToMatch(result, {
      id: user.id,
      name: user.name,
      email: user.email
    })
  })

  it('should not be able to get a non-existing user by email', async () => {
    const input = { email: 'nonexistent@example.com' }

    await expectToThrowResourceNotFound(
      async () => sut.execute(input),
      'User'
    )
  })
})
