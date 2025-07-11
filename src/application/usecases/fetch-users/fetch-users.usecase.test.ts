import { InMemoryUsersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-users.repository'

import { makeUser } from '@/util/factories/domain/make-user'

import { FetchUsersUseCase } from './fetch-users.usecase'

describe('FetchUsersUseCase', () => {
  let usersRepository: InMemoryUsersRepository
  let sut: FetchUsersUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new FetchUsersUseCase(usersRepository)
  })

  it('should be able to fetch a list of users', async () => {
    await usersRepository.save(makeUser())
    await usersRepository.save(makeUser())
    await usersRepository.save(makeUser())

    const result = await sut.execute({ page: 1, pageSize: 10 })

    expect(result.items).toHaveLength(3)
    expect(result.totalItems).toBe(3)
    expect(result.totalPages).toBe(1)
    expect(result.page).toBe(1)
    expect(result.pageSize).toBe(10)
  })

  it('should be able to fetch a paginated list of users', async () => {
    for (let i = 1; i <= 20; i++) {
      await usersRepository.save(makeUser())
    }

    const result = await sut.execute({ page: 2, pageSize: 10 })

    expect(result.items).toHaveLength(10)
    expect(result.totalItems).toBe(20)
    expect(result.totalPages).toBe(2)
    expect(result.page).toBe(2)
    expect(result.pageSize).toBe(10)
  })
})
