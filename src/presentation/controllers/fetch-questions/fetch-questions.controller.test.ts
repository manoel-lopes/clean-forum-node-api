import { InMemoryQuestionsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-questions.repository'
import type { QuestionsRepository } from '@/application/repositories/questions.repository'
import type { Question } from '@/domain/entities/question/question.entity'
import { makeQuestion } from '@/util/factories/domain/make-question'
import { FetchQuestionsController } from './fetch-questions.controller'

describe('FetchQuestionsController', () => {
  let questionsRepository: QuestionsRepository
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
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new FetchQuestionsController(questionsRepository)
  })

  it('should throw an unknown error response if an unexpect error occur', async () => {
    const httpRequest = makeHttpRequest(1, 10)
    const error = new Error('any_error')
    vi.spyOn(questionsRepository, 'findMany').mockRejectedValue(error)
    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 200 with empty array when no questions are found', async () => {
    const paginatedQuestions = makePaginatedQuestions(1, 10, 0, [])
    const httpRequest = makeHttpRequest(1, 10)
    vi.spyOn(questionsRepository, 'findMany').mockResolvedValue(paginatedQuestions)
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(paginatedQuestions)
  })

  it('should return 200 with default pagination when no query is provided', async () => {
    const questions = [makeQuestion()]
    const paginatedQuestions = makePaginatedQuestions(1, 20, 1, questions)
    vi.spyOn(questionsRepository, 'findMany').mockResolvedValue(paginatedQuestions)
    const httpResponse = await sut.handle({})
    expect(httpResponse.statusCode).toBe(200)
    expect(questionsRepository.findMany).toHaveBeenCalledWith({
      page: 1,
      pageSize: 20
    })
    expect(httpResponse.body).toEqual(paginatedQuestions)
  })

  it('should return 200 with correct pagination', async () => {
    const questions = Array.from({ length: 3 }, makeQuestion)
    const paginatedQuestions = makePaginatedQuestions(2, 3, 11, questions)
    const httpRequest = makeHttpRequest(2, 3)
    vi.spyOn(questionsRepository, 'findMany').mockResolvedValue(paginatedQuestions)
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(questionsRepository.findMany).toHaveBeenCalledWith({
      page: 2,
      pageSize: 3
    })
    expect(httpResponse.body).toEqual(paginatedQuestions)
  })
})
