import type { RefreshTokensRepository } from '@/application/repositories/refresh-tokens.repository'
import type { UsersRepository } from '@/application/repositories/users.repository'
import { InMemoryRefreshTokensRepository } from '@/infra/persistence/repositories/in-memory/in-memory-refresh-tokens.repository'
import { InMemoryUsersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-users.repository'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { makeRefreshToken } from '@/util/factories/domain/make-refresh-token'
import { makeUser } from '@/util/factories/domain/make-user'
import { DeleteAccountUseCase } from './delete-account.usecase'

describe('DeleteAccountUseCase', () => {
  let sut: DeleteAccountUseCase
  let usersRepository: UsersRepository
  let refreshTokensRepository: RefreshTokensRepository

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    refreshTokensRepository = new InMemoryRefreshTokensRepository()
    sut = new DeleteAccountUseCase(usersRepository, refreshTokensRepository)
  })

  it('should not delete a nonexistent user account', async () => {
    await expect(sut.execute({
      userId: 'any_inexistent_id'
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

  it('should delete the refresh token when deleting a user account', async () => {
    const user = makeUser()
    await usersRepository.save(user)
    const refreshToken = makeRefreshToken({ userId: user.id })
    await refreshTokensRepository.save(refreshToken)
    const createdRefreshToken = await refreshTokensRepository.findByUserId(user.id)
    expect(createdRefreshToken).not.toBeNull()
    await sut.execute({ userId: user.id })
    const deletedRefreshToken = await refreshTokensRepository.findByUserId(user.id)
    expect(deletedRefreshToken).toBeNull()
  })
})
