import { makeUser } from '@test/util/factories/domain/make-user'
import { InMemoryUsersRepository } from '@test/infra/persistence/repositories/in-memory/in-memory-users.repository'
import { DeleteAccountUseCase } from './delete-account.usecase'
import { ResourceNotFoundError } from '@application/errors/resource-not-found.error'

describe('DeleteAccountUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: DeleteAccountUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new DeleteAccountUseCase(usersRepository)
  })

  it('should be able to delete an account', async () => {
    const user = makeUser()
    await usersRepository.create(user)

    await sut.execute({ userId: user.id })

    expect(usersRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a non-existing account', async () => {
    await expect(sut.execute({ userId: 'non-existing-id' })).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
