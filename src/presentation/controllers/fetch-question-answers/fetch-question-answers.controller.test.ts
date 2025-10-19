import type { UseCase } from '@/core/domain/application/use-case'
import { UseCaseStub } from '@/infra/doubles/use-case.stub'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { makeAnswer } from '@/shared/util/factories/domain/make-answer'
import { FetchQuestionAnswersController } from './fetch-question-answers.controller'

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

function makeAnswers (quantity: number, questionId: string) {
  const answers = []
  for (let i = 0; i < quantity; i++) {
    answers.push(makeAnswer({ questionId }))
  }
  return answers
}

function makeHttpRequest (questionId: string, page?: number, pageSize?: number, order?: 'asc' | 'desc', include?: string) {
  return {
    params: { questionId },
    query: { page, pageSize, order, include },
  }
}

describe('FetchQuestionAnswersController', () => {
  let fetchQuestionAnswersUseCase: UseCase
  let sut: FetchQuestionAnswersController
  const questionId = 'any_question_id'

  beforeEach(() => {
    fetchQuestionAnswersUseCase = new UseCaseStub()
    sut = new FetchQuestionAnswersController(fetchQuestionAnswersUseCase)
  })

  it('should propagate unexpected errors', async () => {
    const httpRequest = makeHttpRequest(questionId, 1, 10)
    const error = new Error('any_error')
    vi.spyOn(fetchQuestionAnswersUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 404 when question does not exist', async () => {
    const httpRequest = makeHttpRequest(questionId, 1, 10)
    const error = new ResourceNotFoundError('Question')
    vi.spyOn(fetchQuestionAnswersUseCase, 'execute').mockRejectedValue(error)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toHaveProperty('error', 'Not Found')
    expect(httpResponse.body).toHaveProperty('message', 'Question not found')
  })

  it('should return 200 with empty array when no answers are found', async () => {
    const paginatedAnswers = makePaginatedResponse(1, 10, 0, [], 'desc')
    const httpRequest = makeHttpRequest(questionId, 1, 10)
    vi.spyOn(fetchQuestionAnswersUseCase, 'execute').mockResolvedValue(paginatedAnswers)

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
    const answers = makeAnswers(1, questionId)
    const paginatedAnswers = makePaginatedResponse(1, 20, 1, answers, 'desc')
    const httpRequest = makeHttpRequest(questionId)
    vi.spyOn(fetchQuestionAnswersUseCase, 'execute').mockResolvedValue(paginatedAnswers)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 1,
      pageSize: 20,
      totalItems: 1,
      totalPages: 1,
      items: answers,
      order: 'desc',
    })
  })

  it('should return 200 with correct pagination', async () => {
    const answers = makeAnswers(3, questionId)
    const paginatedAnswers = makePaginatedResponse(2, 3, 11, answers, 'desc')
    const httpRequest = makeHttpRequest(questionId, 2, 3)
    vi.spyOn(fetchQuestionAnswersUseCase, 'execute').mockResolvedValue(paginatedAnswers)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 2,
      pageSize: 3,
      totalItems: 11,
      totalPages: 4,
      items: answers,
      order: 'desc',
    })
  })

  it('should return 200 with answers sorted in ascending order', async () => {
    const answer1 = makeAnswer({ questionId, createdAt: new Date('2023-01-02') })
    const answer2 = makeAnswer({ questionId, createdAt: new Date('2023-01-03') })
    const answer3 = makeAnswer({ questionId, createdAt: new Date('2023-01-01') })
    const paginatedAnswers = makePaginatedResponse(1, 3, 3, [answer3, answer1, answer2], 'asc')
    const httpRequest = makeHttpRequest(questionId, 1, 10, 'asc')
    vi.spyOn(fetchQuestionAnswersUseCase, 'execute').mockResolvedValue(paginatedAnswers)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 1,
      pageSize: 3,
      totalItems: 3,
      totalPages: 1,
      items: [answer3, answer1, answer2],
      order: 'asc',
    })
  })

  it('should pass include parameter as array to use case', async () => {
    const answers = makeAnswers(1, questionId)
    const paginatedAnswers = makePaginatedResponse(1, 20, 1, answers, 'desc')
    const httpRequest = {
      params: { questionId },
      query: {
        page: undefined,
        pageSize: undefined,
        order: undefined,
        include: ['comments', 'attachments', 'author'],
      },
    }
    vi.spyOn(fetchQuestionAnswersUseCase, 'execute').mockResolvedValue(paginatedAnswers)

    await sut.handle(httpRequest)

    expect(fetchQuestionAnswersUseCase.execute).toHaveBeenCalledWith({
      questionId,
      page: 1,
      pageSize: 20,
      order: 'desc',
      include: ['comments', 'attachments', 'author'],
    })
  })
})
