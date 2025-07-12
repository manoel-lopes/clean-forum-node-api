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

  const makePaginatedUsers = (
    page: number,
    pageSize: number,
    totalItems: number,
    items: User[]
  ) => ({
    page,
    pageSize,
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
    items
  })

  beforeEach(() => {
    usersRepository = {
      save: vi.fn(),
      delete: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      findMany: vi.fn()
    }
    sut = new FetchUsersController(usersRepository)
  })

  it('should throw if usersRepository throws an unknown error', async () => {
    const httpRequest = makeHttpRequest(1, 10)
    const error = new Error('any_error')
    vi.spyOn(usersRepository, 'findMany').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 200 with users data', async () => {
    const users = [makeUser()]
    const paginatedUsers = makePaginatedUsers(1, 10, 1, users)
    const httpRequest = makeHttpRequest(1, 10)
    vi.spyOn(usersRepository, 'findMany').mockResolvedValue(paginatedUsers)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(paginatedUsers)
  })

  it('should return 200 with empty array when no users are found', async () => {
    const paginatedUsers = makePaginatedUsers(1, 10, 0, [])
    const httpRequest = makeHttpRequest(1, 10)
    vi.spyOn(usersRepository, 'findMany').mockResolvedValue(paginatedUsers)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(paginatedUsers)
  })

  it('should return 200 with default pagination when no query is provided', async () => {
    const users = [makeUser()]
    const paginatedUsers = makePaginatedUsers(1, 20, 1, users)
    vi.spyOn(usersRepository, 'findMany').mockResolvedValue(paginatedUsers)

    const httpResponse = await sut.handle({})

    expect(httpResponse.statusCode).toBe(200)
    expect(usersRepository.findMany).toHaveBeenCalledWith({
      page: 1,
      pageSize: 20
    })
    expect(httpResponse.body).toEqual(paginatedUsers)
  })

  it('should return 200 with correct pagination when different page and page size are provided', async () => {
    const users = Array.from({ length: 5 }, makeUser)
    const paginatedUsers = makePaginatedUsers(2, 5, 11, users)
    const httpRequest = makeHttpRequest(2, 5)
    vi.spyOn(usersRepository, 'findMany').mockResolvedValue(paginatedUsers)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(usersRepository.findMany).toHaveBeenCalledWith({
      page: 2,
      pageSize: 5
    })
    expect(httpResponse.body).toEqual(paginatedUsers)
  })
})
