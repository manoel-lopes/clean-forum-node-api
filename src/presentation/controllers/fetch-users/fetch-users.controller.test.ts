import type { UsersRepository } from '@/domain/application/repositories/users.repository'
import { InMemoryUsersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-users.repository'
import { makeUserData } from '@/shared/util/factories/domain/make-user'
import { FetchUsersController } from './fetch-users.controller'

function makePaginatedResponse<T> (
  page: number,
  pageSize: number,
  totalItems: number,
  items: T[],
  order: 'asc' | 'desc' = 'desc'
) {
  return {
    page,
    pageSize,
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
    items,
    order,
  }
}

function makeUsers (quantity: number) {
  const users = []
  for (let i = 0; i < quantity; i++) {
    users.push(makeUserData())
  }
  return users
}

function makeHttpRequest (page?: number, pageSize?: number, order?: 'asc' | 'desc') {
  return {
    query: { page, pageSize, order },
  }
}

describe('FetchUsersController', () => {
  let usersRepository: UsersRepository
  let sut: FetchUsersController

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new FetchUsersController(usersRepository)
  })

  it('should propagate unexpected errors', async () => {
    const httpRequest = makeHttpRequest(1, 10)
    const error = new Error('any_error')
    vi.spyOn(usersRepository, 'findMany').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 200 with empty array when no users are found', async () => {
    const paginatedUsers = makePaginatedResponse(1, 10, 0, [], 'desc')
    const httpRequest = makeHttpRequest(1, 10)

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
    const paginatedUsers = makePaginatedResponse(1, 20, 1, users, 'desc')
    vi.spyOn(usersRepository, 'findMany').mockResolvedValue(paginatedUsers)

    const httpResponse = await sut.handle({ query: {} })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 1,
      pageSize: 20,
      totalItems: 1,
      totalPages: 1,
      items: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
      order: 'desc',
    })
  })

  it('should return 200 with correct pagination', async () => {
    const users = makeUsers(3)
    const paginatedUsers = makePaginatedResponse(2, 3, 11, users, 'desc')
    const httpRequest = makeHttpRequest(2, 3)
    vi.spyOn(usersRepository, 'findMany').mockResolvedValue(paginatedUsers)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 2,
      pageSize: 3,
      totalItems: 11,
      totalPages: 4,
      items: users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
      order: 'desc',
    })
  })

  it('should return 200 with users sorted in ascending order', async () => {
    const user1 = await usersRepository.create(makeUserData())
    const user2 = await usersRepository.create(makeUserData())
    const user3 = await usersRepository.create(makeUserData())

    const httpResponse = await sut.handle(makeHttpRequest(1, 10, 'asc'))

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 1,
      pageSize: 3,
      totalItems: 3,
      totalPages: 1,
      items: [user3, user1, user2].map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
      order: 'asc',
    })
  })
})
