import type { UseCase } from '@/core/application/use-case'

import { UseCaseStub } from '@/infra/doubles/stubs/use-case.stub'

import type { Question } from '@/domain/entities/question/question.entity'

import { makeQuestion } from '@/util/factories/domain/make-question'

import { FetchQuestionsController } from './fetch-questions.controller'

describe('FetchQuestionsController', () => {
  let fetchQuestionsUseCase: UseCase
  let sut: FetchQuestionsController

  const makeHttpRequest = (page?: number, pageSize?: number) => ({
    query: { page, pageSize }
  })

  const makePaginatedQuestions = (
    page: number,
    pageSize: number,
    totalItems: number,
    items: Question[]
  ) => ({
    page,
    pageSize,
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
    items
  })

  beforeEach(() => {
    fetchQuestionsUseCase = new UseCaseStub()
    sut = new FetchQuestionsController(fetchQuestionsUseCase)
  })

  it('should throw if FetchQuestionsUseCase throws an unknown error', async () => {
    const httpRequest = makeHttpRequest(1, 10)
    const error = new Error('any_error')
    vi.spyOn(fetchQuestionsUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 200 with questions data', async () => {
    const questions = [makeQuestion()]
    const paginatedQuestions = makePaginatedQuestions(1, 10, 1, questions)
    const httpRequest = makeHttpRequest(1, 10)
    vi.spyOn(fetchQuestionsUseCase, 'execute').mockResolvedValue(paginatedQuestions)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(paginatedQuestions)
  })

  it('should return 200 with empty array when no questions are found', async () => {
    const paginatedQuestions = makePaginatedQuestions(1, 10, 0, [])
    const httpRequest = makeHttpRequest(1, 10)
    vi.spyOn(fetchQuestionsUseCase, 'execute').mockResolvedValue(paginatedQuestions)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(paginatedQuestions)
  })

  it('should return 200 with default pagination when no query is provided', async () => {
    const questions = [makeQuestion()]
    const paginatedQuestions = makePaginatedQuestions(1, 20, 1, questions)
    vi.spyOn(fetchQuestionsUseCase, 'execute').mockResolvedValue(paginatedQuestions)

    const httpResponse = await sut.handle({})

    expect(httpResponse.statusCode).toBe(200)
    expect(fetchQuestionsUseCase.execute).toHaveBeenCalledWith({
      page: 1,
      pageSize: 20
    })
    expect(httpResponse.body).toEqual(paginatedQuestions)
  })

  it('should return 200 with correct pagination when different page and page size are provided', async () => {
    const questions = Array.from({ length: 5 }, makeQuestion)
    const paginatedQuestions = makePaginatedQuestions(2, 5, 11, questions)
    const httpRequest = makeHttpRequest(2, 5)
    vi.spyOn(fetchQuestionsUseCase, 'execute').mockResolvedValue(paginatedQuestions)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(fetchQuestionsUseCase.execute).toHaveBeenCalledWith({
      page: 2,
      pageSize: 5
    })
    expect(httpResponse.body).toEqual(paginatedQuestions)
  })
})
