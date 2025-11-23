import { makeUserData } from 'tests/factories/domain/make-user'
import { makeHttpFetchRequest } from 'tests/helpers/http/pagination-request-builder'
import { mockPaginatedResponse } from 'tests/helpers/http/pagination-response-builder'
import { uuidv7 } from 'uuidv7'
import type { UsersRepository } from '@/domain/application/repositories/users.repository'
import { InMemoryUsersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-users.repository'
import { FetchUsersController } from './fetch-users.controller'

function makeUsers (quantity: number) {
  const users = []
  for (let i = 0; i < quantity; i++) {
    users.push({
      ...makeUserData(),
      id: uuidv7(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }
  return users
}

describe('FetchUsersController', () => {
  let usersRepository: UsersRepository
  let sut: FetchUsersController

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new FetchUsersController(usersRepository)
  })

  it('should propagate unexpected errors', async () => {
    const httpRequest = makeHttpFetchRequest(1, 10)
    const error = new Error('any_error')
    vi.spyOn(usersRepository, 'findMany').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 200 with empty array when no users are found', async () => {
    const paginatedUsers = mockPaginatedResponse(1, 10, 0, [], 'desc')
    const httpRequest = makeHttpFetchRequest(1, 10)
    vi.spyOn(usersRepository, 'findMany').mockResolvedValue(paginatedUsers)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
      items: [],
      order: 'desc',
    })
  })

  it('should return 200 with default pagination when no query is provided', async () => {
    const users = makeUsers(1)
    const paginatedUsers = mockPaginatedResponse(1, 20, 1, users, 'desc')
    vi.spyOn(usersRepository, 'findMany').mockResolvedValue(paginatedUsers)

    const httpResponse = await sut.handle({ query: {} })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 1,
      pageSize: 20,
      totalItems: 1,
      totalPages: 1,
      order: 'desc',
      items: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
    })
  })

  it('should return 200 with correct pagination', async () => {
    const users = makeUsers(3)
    const paginatedUsers = mockPaginatedResponse(2, 3, 11, users, 'desc')
    const httpRequest = makeHttpFetchRequest(2, 3)
    vi.spyOn(usersRepository, 'findMany').mockResolvedValue(paginatedUsers)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 2,
      pageSize: 3,
      totalItems: 11,
      totalPages: 4,
      order: 'desc',
      items: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
    })
  })

  it('should return 200 with users sorted in ascending order', async () => {
    const user1 = await usersRepository.create(makeUserData())
    const user2 = await usersRepository.create(makeUserData())
    const user3 = await usersRepository.create(makeUserData())

    const httpResponse = await sut.handle(makeHttpFetchRequest(1, 10, 'asc'))

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 1,
      pageSize: 10,
      totalItems: 3,
      totalPages: 1,
      order: 'asc',
      items: [user1, user2, user3].map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
    })
  })
})
