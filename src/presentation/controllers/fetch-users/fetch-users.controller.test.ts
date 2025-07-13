import { InMemoryUsersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-users.repository'

import type { UsersRepository } from '@/application/repositories/users.repository'

import type { User } from '@/domain/entities/user/user.entity'

import { makeUser } from '@/util/factories/domain/make-user'

import { FetchUsersController } from './fetch-users.controller'

describe('FetchUsersController', () => {
  let usersRepository: UsersRepository
  let sut: FetchUsersController

  const makeHttpRequest = (page?: number, pageSize?: number) => ({
    query: { page, pageSize }
  })

  const makeUsers = async (count: number, saveUserFn: (user: User) => Promise<void>) => {
    const users = Array.from({ length: count }, () => makeUser())
    for (const user of users) {
      await saveUserFn(user)
    }
    return users
  }

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new FetchUsersController(usersRepository)
  })

  it('should return 200 with empty array when no users are found', async () => {
    const httpResponse = await sut.handle(makeHttpRequest(1, 10))

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
      items: []
    })
  })

  it('should return 200 with default pagination when no query is provided', async () => {
    const user = makeUser()
    await usersRepository.save(user)
    const httpResponse = await sut.handle({})

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 1,
      pageSize: 20,
      totalItems: 1,
      totalPages: 1,
      items: [{
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }]
    })
  })

  it('should return 200 with correct pagination', async () => {
    const users = await makeUsers(5, user => usersRepository.save(user))
    const httpResponse = await sut.handle(makeHttpRequest(1, 2))

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 1,
      pageSize: 2,
      totalItems: 5,
      totalPages: 3,
      items: users.slice(0, 2).map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }))
    })
  })
})
