import { makeAnswerData } from 'tests/factories/domain/make-answer'
import { UseCaseStub } from 'tests/helpers/domain/application/use-case.stub'
import { makeHttpFetchRequestWithParams } from 'tests/helpers/http/pagination-request-builder'
import { mockPaginatedResponse } from 'tests/helpers/http/pagination-response-builder'
import type { UseCase } from '@/core/domain/application/use-case'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { FetchQuestionAnswersController } from './fetch-question-answers.controller'

function makeAnswers (quantity: number, questionId: string) {
  const answers = []
  for (let i = 0; i < quantity; i++) {
    answers.push(makeAnswerData({ questionId }))
  }
  return answers
}

function makeHttpFetchRequest (questionId: string, page?: number, pageSize?: number, order?: 'asc' | 'desc', include?: string) {
  return makeHttpFetchRequestWithParams({ questionId }, page, pageSize, order, include)
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
    const httpRequest = makeHttpFetchRequest(questionId, 1, 10)
    const error = new Error('any_error')
    vi.spyOn(fetchQuestionAnswersUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 404 when question does not exist', async () => {
    const httpRequest = makeHttpFetchRequest(questionId, 1, 10)
    const error = new ResourceNotFoundError('Question')
    vi.spyOn(fetchQuestionAnswersUseCase, 'execute').mockRejectedValue(error)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toHaveProperty('error', 'Not Found')
    expect(httpResponse.body).toHaveProperty('message', 'Question not found')
  })

  it('should return 200 with empty array when no answers are found', async () => {
    const paginatedAnswers = mockPaginatedResponse(1, 10, 0, [], 'desc')
    const httpRequest = makeHttpFetchRequest(questionId, 1, 10)
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
    const paginatedAnswers = mockPaginatedResponse(1, 20, 1, answers, 'desc')
    const httpRequest = makeHttpFetchRequest(questionId)
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
    const paginatedAnswers = mockPaginatedResponse(2, 3, 11, answers, 'desc')
    const httpRequest = makeHttpFetchRequest(questionId, 2, 3)
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
    const answer1 = { ...makeAnswerData({ questionId }), id: 'answer-1', createdAt: new Date('2023-01-02'), updatedAt: new Date() }
    const answer2 = { ...makeAnswerData({ questionId }), id: 'answer-2', createdAt: new Date('2023-01-03'), updatedAt: new Date() }
    const answer3 = { ...makeAnswerData({ questionId }), id: 'answer-3', createdAt: new Date('2023-01-01'), updatedAt: new Date() }
    const paginatedAnswers = mockPaginatedResponse(1, 3, 3, [answer3, answer1, answer2], 'asc')
    const httpRequest = makeHttpFetchRequest(questionId, 1, 10, 'asc')
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
    const paginatedAnswers = mockPaginatedResponse(1, 20, 1, answers, 'desc')
    const httpRequest = {
      params: { questionId },
      query: {
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

  it('should return 200 with include parameter as "comments"', async () => {
    const answers = makeAnswers(3, questionId)
    const paginatedAnswers = mockPaginatedResponse(1, 10, 3, answers, 'desc')
    const httpRequest = makeHttpFetchRequest(questionId, 1, 10, 'desc', 'comments')
    vi.spyOn(fetchQuestionAnswersUseCase, 'execute').mockResolvedValue(paginatedAnswers)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 1,
      pageSize: 10,
      totalItems: 3,
      totalPages: 1,
      items: answers,
      order: 'desc',
    })
    expect(fetchQuestionAnswersUseCase.execute).toHaveBeenCalledWith({
      questionId,
      page: 1,
      pageSize: 10,
      order: 'desc',
      include: 'comments',
    })
  })

  it('should return 200 with include parameter as "attachments"', async () => {
    const answers = makeAnswers(2, questionId)
    const paginatedAnswers = mockPaginatedResponse(1, 10, 2, answers, 'desc')
    const httpRequest = makeHttpFetchRequest(questionId, 1, 10, 'desc', 'attachments')
    vi.spyOn(fetchQuestionAnswersUseCase, 'execute').mockResolvedValue(paginatedAnswers)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 1,
      pageSize: 10,
      totalItems: 2,
      totalPages: 1,
      items: answers,
      order: 'desc',
    })
    expect(fetchQuestionAnswersUseCase.execute).toHaveBeenCalledWith({
      questionId,
      page: 1,
      pageSize: 10,
      order: 'desc',
      include: 'attachments',
    })
  })

  it('should return 200 with include parameter as "author"', async () => {
    const answers = makeAnswers(1, questionId)
    const paginatedAnswers = mockPaginatedResponse(1, 10, 1, answers, 'desc')
    const httpRequest = makeHttpFetchRequest(questionId, 1, 10, 'desc', 'author')
    vi.spyOn(fetchQuestionAnswersUseCase, 'execute').mockResolvedValue(paginatedAnswers)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 1,
      pageSize: 10,
      totalItems: 1,
      totalPages: 1,
      items: answers,
      order: 'desc',
    })
    expect(fetchQuestionAnswersUseCase.execute).toHaveBeenCalledWith({
      questionId,
      page: 1,
      pageSize: 10,
      order: 'desc',
      include: 'author',
    })
  })

  it('should return 200 with page 2 and pageSize 15', async () => {
    const answers = makeAnswers(15, questionId)
    const paginatedAnswers = mockPaginatedResponse(2, 15, 30, answers, 'desc')
    const httpRequest = makeHttpFetchRequest(questionId, 2, 15, 'desc')
    vi.spyOn(fetchQuestionAnswersUseCase, 'execute').mockResolvedValue(paginatedAnswers)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 2,
      pageSize: 15,
      totalItems: 30,
      totalPages: 2,
      items: answers,
      order: 'desc',
    })
  })
})
