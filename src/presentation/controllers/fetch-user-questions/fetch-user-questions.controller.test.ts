import type { UseCase } from '@/core/domain/application/use-case'
import { UseCaseStub } from '@/infra/doubles/use-case.stub'
import { makeQuestion } from '@/shared/util/factories/domain/make-question'
import { FetchUserQuestionsController } from './fetch-user-questions.controller'

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
    order
  }
}

function makeQuestions (quantity: number, userId: string) {
  const questions = []
  for (let i = 0; i < quantity; i++) {
    questions.push(makeQuestion({ authorId: userId }))
  }
  return questions
}

function makeHttpRequest (userId: string, page?: number, pageSize?: number, order?: 'asc' | 'desc') {
  return {
    params: { userId },
    query: { page, pageSize, order }
  }
}

describe('FetchUserQuestionsController', () => {
  let fetchUserQuestionsUseCase: UseCase
  let sut: FetchUserQuestionsController
  const userId = 'any_user_id'

  beforeEach(() => {
    fetchUserQuestionsUseCase = new UseCaseStub()
    sut = new FetchUserQuestionsController(fetchUserQuestionsUseCase)
  })

  it('should propagate unexpected errors', async () => {
    const httpRequest = makeHttpRequest(userId, 1, 10)
    const error = new Error('any_error')
    vi.spyOn(fetchUserQuestionsUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 200 with empty array when no questions are found', async () => {
    const paginatedQuestions = makePaginatedResponse(1, 10, 0, [], 'desc')
    const httpRequest = makeHttpRequest(userId, 1, 10)
    vi.spyOn(fetchUserQuestionsUseCase, 'execute').mockResolvedValue(paginatedQuestions)

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
    const questions = makeQuestions(1, userId)
    const paginatedQuestions = makePaginatedResponse(1, 20, 1, questions, 'desc')
    const httpRequest = makeHttpRequest(userId)
    vi.spyOn(fetchUserQuestionsUseCase, 'execute').mockResolvedValue(paginatedQuestions)

    const httpResponse = await sut.handle(httpRequest)

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
    const questions = makeQuestions(3, userId)
    const paginatedQuestions = makePaginatedResponse(2, 3, 11, questions, 'desc')
    const httpRequest = makeHttpRequest(userId, 2, 3)
    vi.spyOn(fetchUserQuestionsUseCase, 'execute').mockResolvedValue(paginatedQuestions)

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
    const question1 = makeQuestion({ authorId: userId, createdAt: new Date('2023-01-02') })
    const question2 = makeQuestion({ authorId: userId, createdAt: new Date('2023-01-03') })
    const question3 = makeQuestion({ authorId: userId, createdAt: new Date('2023-01-01') })
    const paginatedQuestions = makePaginatedResponse(1, 3, 3, [question3, question1, question2], 'asc')
    const httpRequest = makeHttpRequest(userId, 1, 10, 'asc')
    vi.spyOn(fetchUserQuestionsUseCase, 'execute').mockResolvedValue(paginatedQuestions)

    const httpResponse = await sut.handle(httpRequest)

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
