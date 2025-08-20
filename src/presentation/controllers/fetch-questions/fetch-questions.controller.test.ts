import type { QuestionsRepository } from '@/application/repositories/questions.repository'
import { InMemoryQuestionsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-questions.repository'
import { makeQuestion } from '@/util/factories/domain/make-question'
import { FetchQuestionsController } from './fetch-questions.controller'

function makePaginatedResponse<T> (
  page: number,
  pageSize: number,
  totalItems: number,
  items: T[],
  order?: 'asc' | 'desc'
) {
  return {
    page,
    pageSize,
    totalItems,
    totalPages: Math.ceil(totalItems / pageSize),
    items,
    order
  }
}

function makeQuestions (quantity: number) {
  const questions = []
  for (let i = 0; i < quantity; i++) {
    questions.push(makeQuestion())
  }
  return questions
}

function makeHttpRequest (page?: number, pageSize?: number, order?: 'asc' | 'desc') {
  return {
    query: { page, pageSize, order }
  }
}

describe('FetchQuestionsController', () => {
  let questionsRepository: QuestionsRepository
  let sut: FetchQuestionsController

  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new FetchQuestionsController(questionsRepository)
  })

  it('should throw an an unexpect error', async () => {
    const httpRequest = makeHttpRequest(1, 10)
    const error = new Error('any_error')
    vi.spyOn(questionsRepository, 'findMany').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 200 with empty array when no questions are found', async () => {
    const paginatedQuestions = makePaginatedResponse(1, 10, 0, [], 'desc')
    const httpRequest = makeHttpRequest(1, 10)

    vi.spyOn(questionsRepository, 'findMany').mockResolvedValue(paginatedQuestions)

    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 0,
      items: [],
      order: 'desc'
    })
  })

  it('should return 200 with default pagination when no query is provided', async () => {
    const questions = makeQuestions(1)
    const paginatedQuestions = makePaginatedResponse(1, 20, 1, questions, 'desc')
    vi.spyOn(questionsRepository, 'findMany').mockResolvedValue(paginatedQuestions)

    const httpResponse = await sut.handle({ query: {} })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 1,
      pageSize: 20,
      totalItems: 1,
      totalPages: 1,
      items: questions,
      order: 'desc'
    })
  })

  it('should return 200 with correct pagination', async () => {
    const questions = makeQuestions(3)
    const paginatedQuestions = makePaginatedResponse(2, 3, 11, questions, 'desc')
    const httpRequest = makeHttpRequest(2, 3)
    vi.spyOn(questionsRepository, 'findMany').mockResolvedValue(paginatedQuestions)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 2,
      pageSize: 3,
      totalItems: 11,
      totalPages: 4,
      items: questions,
      order: 'desc'
    })
  })

  it('should return 200 with questions sorted in ascending order', async () => {
    const question1 = makeQuestion({ createdAt: new Date('2023-01-02') })
    const question2 = makeQuestion({ createdAt: new Date('2023-01-03') })
    const question3 = makeQuestion({ createdAt: new Date('2023-01-01') })
    await questionsRepository.save(question1)
    await questionsRepository.save(question2)
    await questionsRepository.save(question3)

    const httpResponse = await sut.handle(makeHttpRequest(1, 10, 'asc'))

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 1,
      pageSize: 3,
      totalItems: 3,
      totalPages: 1,
      items: [question3, question1, question2],
      order: 'asc'
    })
  })
})
