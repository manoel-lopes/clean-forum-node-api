import type { QuestionsRepository } from '@/domain/application/repositories/questions.repository'
import { InMemoryQuestionsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-questions.repository'
import type { Question } from '@/domain/enterprise/entities/question.entity'
import { makeQuestionData } from '@/shared/util/factories/domain/make-question'
import { makeHttpFetchRequest } from '@/shared/util/test/make-http-fetch-request'
import { mockPaginatedResponse } from '@/shared/util/test/mock-paginated-response'
import { FetchQuestionsController } from './fetch-questions.controller'

function makeQuestions (quantity: number): Question[] {
  const questions: Question[] = []
  for (let i = 0; i < quantity; i++) {
    questions.push({
      ...makeQuestionData(),
      id: `question-${i}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }
  return questions
}

describe('FetchQuestionsController', () => {
  let questionsRepository: QuestionsRepository
  let sut: FetchQuestionsController

  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new FetchQuestionsController(questionsRepository)
  })

  it('should propagate unexpected errors', async () => {
    const httpRequest = makeHttpFetchRequest(1, 10)
    const error = new Error('any_error')
    vi.spyOn(questionsRepository, 'findMany').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 200 with empty array when no questions are found', async () => {
    const paginatedQuestions = mockPaginatedResponse(1, 10, 0, [], 'desc')
    const httpRequest = makeHttpFetchRequest(1, 10)

    vi.spyOn(questionsRepository, 'findMany').mockResolvedValue(paginatedQuestions)

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
    const questions = makeQuestions(1)
    const paginatedQuestions = mockPaginatedResponse(1, 20, 1, questions, 'desc')
    vi.spyOn(questionsRepository, 'findMany').mockResolvedValue(paginatedQuestions)

    const httpResponse = await sut.handle({ query: {} })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 1,
      pageSize: 20,
      totalItems: 1,
      totalPages: 1,
      items: questions,
      order: 'desc',
    })
  })

  it('should return 200 with correct pagination', async () => {
    const questions = makeQuestions(3)
    const paginatedQuestions = mockPaginatedResponse(2, 3, 11, questions, 'desc')
    const httpRequest = makeHttpFetchRequest(2, 3)
    vi.spyOn(questionsRepository, 'findMany').mockResolvedValue(paginatedQuestions)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 2,
      pageSize: 3,
      totalItems: 11,
      totalPages: 4,
      items: questions,
      order: 'desc',
    })
  })

  it('should return 200 with questions sorted in ascending order', async () => {
    const question1: Question = {
      ...makeQuestionData(),
      id: 'question-1',
      createdAt: new Date('2023-01-02'),
      updatedAt: new Date(),
    }
    const question2: Question = {
      ...makeQuestionData(),
      id: 'question-2',
      createdAt: new Date('2023-01-03'),
      updatedAt: new Date(),
    }
    const question3: Question = {
      ...makeQuestionData(),
      id: 'question-3',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date(),
    }
    const questions = [question3, question1, question2]
    const paginatedQuestions = mockPaginatedResponse(1, 3, 3, questions, 'asc')
    const httpRequest = makeHttpFetchRequest(1, 10, 'asc')
    vi.spyOn(questionsRepository, 'findMany').mockResolvedValue(paginatedQuestions)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 1,
      pageSize: 3,
      totalItems: 3,
      totalPages: 1,
      items: questions,
      order: 'asc',
    })
  })

  it('should return 200 with page 3 when requested', async () => {
    const questions = makeQuestions(5)
    const paginatedQuestions = mockPaginatedResponse(3, 5, 15, questions, 'desc')
    const httpRequest = makeHttpFetchRequest(3, 5)
    vi.spyOn(questionsRepository, 'findMany').mockResolvedValue(paginatedQuestions)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 3,
      pageSize: 5,
      totalItems: 15,
      totalPages: 3,
      items: questions,
      order: 'desc',
    })
  })

  it('should return 200 with pageSize of 50 when requested', async () => {
    const questions = makeQuestions(10)
    const paginatedQuestions = mockPaginatedResponse(1, 50, 100, questions, 'desc')
    const httpRequest = makeHttpFetchRequest(1, 50)
    vi.spyOn(questionsRepository, 'findMany').mockResolvedValue(paginatedQuestions)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 1,
      pageSize: 50,
      totalItems: 100,
      totalPages: 2,
      items: questions,
      order: 'desc',
    })
  })

  it('should return 200 with pageSize of 5 when requested', async () => {
    const questions = makeQuestions(5)
    const paginatedQuestions = mockPaginatedResponse(1, 5, 25, questions, 'desc')
    const httpRequest = makeHttpFetchRequest(1, 5)
    vi.spyOn(questionsRepository, 'findMany').mockResolvedValue(paginatedQuestions)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 1,
      pageSize: 5,
      totalItems: 25,
      totalPages: 5,
      items: questions,
      order: 'desc',
    })
  })
})
