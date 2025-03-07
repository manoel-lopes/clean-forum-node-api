import type { UsersRepository } from '@/application/repositories/users.repository'
import {
  InMemoryUsersRepository,
} from '@/infra/persistence/repositories/in-memory/in-memory-users.repository'
import { makeUser } from '@/util/factories/domain/make-user'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { DeleteAccountUseCase } from './delete-account.usecase'

describe('DeleteAccountUseCase', () => {
  let sut: DeleteAccountUseCase
  let usersRepository: UsersRepository

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new DeleteAccountUseCase(usersRepository)
  })

  it('should not delete a nonexistent user account', async () => {
    await expect(sut.execute({
      userId: 'any_inexistent_id',
    })).rejects.toThrowError(new ResourceNotFoundError('User'))
  })

  it('should delete a user account', async () => {
    const user = makeUser()
    await usersRepository.save(user)

    const currentAccount = await usersRepository.findById(user.id)
    expect(currentAccount?.id).toBe(user.id)
    expect(currentAccount?.name).toBe(user.name)
    expect(currentAccount?.email).toBe(user.email)

    await sut.execute({ userId: user.id })

    const deletedAccount = await usersRepository.findById(user.id)
    expect(deletedAccount).toBeNull()
  })
})
