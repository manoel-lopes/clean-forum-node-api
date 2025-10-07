import type { AnswerCommentsRepository } from '@/domain/application/repositories/answer-comments.repository'
import { InMemoryAnswerCommentsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-answer-comments.repository'
import { FetchAnswerCommentsUseCase } from '@/domain/application/usecases/fetch-answer-comments/fetch-answer-comments.usecase'
import { makeAnswerComment } from '@/shared/util/factories/domain/make-answer-comment'
import { FetchAnswerCommentsController } from './fetch-answer-comments.controller'

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

function makeAnswerComments (quantity: number, answerId: string) {
  const comments = []
  for (let i = 0; i < quantity; i++) {
    comments.push(makeAnswerComment({ answerId }))
  }
  return comments
}

function makeHttpRequest (answerId: string, page?: number, pageSize?: number) {
  return {
    params: { answerId },
    query: { page, pageSize }
  }
}

describe('FetchAnswerCommentsController', () => {
  let answerCommentsRepository: AnswerCommentsRepository
  let fetchAnswerCommentsUseCase: FetchAnswerCommentsUseCase
  let sut: FetchAnswerCommentsController

  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    fetchAnswerCommentsUseCase = new FetchAnswerCommentsUseCase(answerCommentsRepository)
    sut = new FetchAnswerCommentsController(fetchAnswerCommentsUseCase)
  })

  it('should propagate unexpected errors', async () => {
    const answerId = 'answer-id'
    const httpRequest = makeHttpRequest(answerId, 1, 10)
    const error = new Error('any_error')
    vi.spyOn(answerCommentsRepository, 'findManyByAnswerId').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 200 with empty array when no comments are found', async () => {
    const answerId = 'answer-id'
    const paginatedComments = makePaginatedResponse(1, 10, 0, [], 'desc')
    const httpRequest = makeHttpRequest(answerId, 1, 10)
    vi.spyOn(answerCommentsRepository, 'findManyByAnswerId').mockResolvedValue(paginatedComments)

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
    const answerId = 'answer-id'
    const comments = makeAnswerComments(1, answerId)
    const paginatedComments = makePaginatedResponse(1, 20, 1, comments, 'desc')
    vi.spyOn(answerCommentsRepository, 'findManyByAnswerId').mockResolvedValue(paginatedComments)

    const httpResponse = await sut.handle({ params: { answerId }, query: {} })

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 1,
      pageSize: 20,
      totalItems: 1,
      totalPages: 1,
      items: comments,
      order: 'desc'
    })
  })

  it('should return 200 with correct pagination', async () => {
    const answerId = 'answer-id'
    const comments = makeAnswerComments(3, answerId)
    const paginatedComments = makePaginatedResponse(2, 3, 11, comments, 'desc')
    const httpRequest = makeHttpRequest(answerId, 2, 3)
    vi.spyOn(answerCommentsRepository, 'findManyByAnswerId').mockResolvedValue(paginatedComments)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 2,
      pageSize: 3,
      totalItems: 11,
      totalPages: 4,
      items: comments,
      order: 'desc'
    })
  })
})
