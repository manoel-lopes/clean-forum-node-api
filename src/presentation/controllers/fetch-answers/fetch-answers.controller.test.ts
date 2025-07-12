import type { AnswersRepository } from '@/application/repositories/answers.repository'

import type { Answer } from '@/domain/entities/answer/answer.entity'

import { makeAnswer } from '@/util/factories/domain/make-answer'

import { FetchAnswersController } from './fetch-answers.controller'

describe('FetchAnswersController', () => {
  let answersRepository: AnswersRepository
  let sut: FetchAnswersController

  const makeHttpRequest = (page?: number, pageSize?: number) => ({
    query: { page, pageSize }
  })

  const makePaginatedAnswers = (
    page: number,
    pageSize: number,
    totalItems: number,
    items: Answer[]
  ) => ({
    page,
    pageSize,
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
    items
  })

  beforeEach(() => {
    answersRepository = {
      save: vi.fn(),
      delete: vi.fn(),
      findById: vi.fn(),
      findMany: vi.fn()
    }
    sut = new FetchAnswersController(answersRepository)
  })

  it('should throw if answersRepository throws an unknown error', async () => {
    const httpRequest = makeHttpRequest(1, 10)
    const error = new Error('any_error')
    vi.spyOn(answersRepository, 'findMany').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 200 with answers data', async () => {
    const answers = [makeAnswer()]
    const paginatedAnswers = makePaginatedAnswers(1, 10, 1, answers)
    const httpRequest = makeHttpRequest(1, 10)
    vi.spyOn(answersRepository, 'findMany').mockResolvedValue(paginatedAnswers)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(paginatedAnswers)
  })

  it('should return 200 with empty array when no answers are found', async () => {
    const paginatedAnswers = makePaginatedAnswers(1, 10, 0, [])
    const httpRequest = makeHttpRequest(1, 10)
    vi.spyOn(answersRepository, 'findMany').mockResolvedValue(paginatedAnswers)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(paginatedAnswers)
  })

  it('should return 200 with default pagination when no query is provided', async () => {
    const answers = [makeAnswer()]
    const paginatedAnswers = makePaginatedAnswers(1, 20, 1, answers)
    vi.spyOn(answersRepository, 'findMany').mockResolvedValue(paginatedAnswers)

    const httpResponse = await sut.handle({})

    expect(httpResponse.statusCode).toBe(200)
    expect(answersRepository.findMany).toHaveBeenCalledWith({
      page: 1,
      pageSize: 20
    })
    expect(httpResponse.body).toEqual(paginatedAnswers)
  })

  it('should return 200 with correct pagination when different page and page size are provided', async () => {
    const answers = Array.from({ length: 5 }, makeAnswer)
    const paginatedAnswers = makePaginatedAnswers(2, 5, 11, answers)
    const httpRequest = makeHttpRequest(2, 5)
    vi.spyOn(answersRepository, 'findMany').mockResolvedValue(paginatedAnswers)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(answersRepository.findMany).toHaveBeenCalledWith({
      page: 2,
      pageSize: 5
    })
    expect(httpResponse.body).toEqual(paginatedAnswers)
  })
})
