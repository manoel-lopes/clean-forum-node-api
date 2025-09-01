import type { QuestionCommentsRepository } from '@/application/repositories/question-comments.repository'
import { FetchQuestionCommentsUseCase } from '@/application/usecases/fetch-question-comments/fetch-question-comments.usecase'
import { InMemoryQuestionCommentsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-question-comments.repository'
import { makeQuestionComment } from '@/util/factories/domain/make-question-comment'
import { FetchQuestionCommentsController } from './fetch-question-comments.controller'

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

function makeQuestionComments (quantity: number, questionId: string) {
  const comments = []
  for (let i = 0; i < quantity; i++) {
    comments.push(makeQuestionComment({ questionId }))
  }
  return comments
}

function makeHttpRequest (questionId: string, page?: number, perPage?: number) {
  return {
    params: { questionId },
    query: { page, perPage }
  }
}

describe('FetchQuestionCommentsController', () => {
  let questionCommentsRepository: QuestionCommentsRepository
  let fetchQuestionCommentsUseCase: FetchQuestionCommentsUseCase
  let sut: FetchQuestionCommentsController

  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    fetchQuestionCommentsUseCase = new FetchQuestionCommentsUseCase(questionCommentsRepository)
    sut = new FetchQuestionCommentsController(fetchQuestionCommentsUseCase)
  })

  it('should throw an an unexpect error', async () => {
    const questionId = 'question-id'
    const httpRequest = makeHttpRequest(questionId, 1, 10)
    const error = new Error('any_error')
    vi.spyOn(questionCommentsRepository, 'findManyByQuestionId').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 200 with empty array when no comments are found', async () => {
    const questionId = 'question-id'
    const paginatedComments = makePaginatedResponse(1, 10, 0, [], 'desc')
    const httpRequest = makeHttpRequest(questionId, 1, 10)

    vi.spyOn(questionCommentsRepository, 'findManyByQuestionId').mockResolvedValue(paginatedComments)

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
    const questionId = 'question-id'
    const comments = makeQuestionComments(1, questionId)
    const paginatedComments = makePaginatedResponse(1, 20, 1, comments, 'desc')
    vi.spyOn(questionCommentsRepository, 'findManyByQuestionId').mockResolvedValue(paginatedComments)

    const httpResponse = await sut.handle({ params: { questionId }, query: {} })

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
    const questionId = 'question-id'
    const comments = makeQuestionComments(3, questionId)
    const paginatedComments = makePaginatedResponse(2, 3, 11, comments, 'desc')
    const httpRequest = makeHttpRequest(questionId, 2, 3)
    vi.spyOn(questionCommentsRepository, 'findManyByQuestionId').mockResolvedValue(paginatedComments)

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