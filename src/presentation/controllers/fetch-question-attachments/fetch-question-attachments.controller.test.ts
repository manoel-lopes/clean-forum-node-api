import type { UseCase } from '@/core/domain/application/use-case'
import { UseCaseStub } from '@/infra/doubles/use-case.stub'
import { makeQuestionAttachment } from '@/shared/util/factories/domain/make-question-attachment'
import { FetchQuestionAttachmentsController } from './fetch-question-attachments.controller'

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

function makeAttachments (quantity: number, questionId: string) {
  const attachments = []
  for (let i = 0; i < quantity; i++) {
    attachments.push(makeQuestionAttachment({ questionId }))
  }
  return attachments
}

function makeHttpRequest (questionId: string, page?: number, pageSize?: number, order?: 'asc' | 'desc') {
  return {
    params: { questionId },
    query: { page, pageSize, order }
  }
}

describe('FetchQuestionAttachmentsController', () => {
  let fetchQuestionAttachmentsUseCase: UseCase
  let sut: FetchQuestionAttachmentsController
  const questionId = 'any_question_id'

  beforeEach(() => {
    fetchQuestionAttachmentsUseCase = new UseCaseStub()
    sut = new FetchQuestionAttachmentsController(fetchQuestionAttachmentsUseCase)
  })

  it('should propagate unexpected errors', async () => {
    const httpRequest = makeHttpRequest(questionId, 1, 10)
    const error = new Error('any_error')
    vi.spyOn(fetchQuestionAttachmentsUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 200 with empty array when no attachments are found', async () => {
    const paginatedAttachments = makePaginatedResponse(1, 10, 0, [], 'desc')
    const httpRequest = makeHttpRequest(questionId, 1, 10)
    vi.spyOn(fetchQuestionAttachmentsUseCase, 'execute').mockResolvedValue(paginatedAttachments)

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
    const attachments = makeAttachments(1, questionId)
    const paginatedAttachments = makePaginatedResponse(1, 10, 1, attachments, 'desc')
    const httpRequest = makeHttpRequest(questionId)
    vi.spyOn(fetchQuestionAttachmentsUseCase, 'execute').mockResolvedValue(paginatedAttachments)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 1,
      pageSize: 10,
      totalItems: 1,
      totalPages: 1,
      items: attachments,
      order: 'desc'
    })
  })

  it('should return 200 with correct pagination', async () => {
    const attachments = makeAttachments(3, questionId)
    const paginatedAttachments = makePaginatedResponse(2, 3, 11, attachments, 'desc')
    const httpRequest = makeHttpRequest(questionId, 2, 3)
    vi.spyOn(fetchQuestionAttachmentsUseCase, 'execute').mockResolvedValue(paginatedAttachments)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 2,
      pageSize: 3,
      totalItems: 11,
      totalPages: 4,
      items: attachments,
      order: 'desc'
    })
  })

  it('should return 200 with attachments sorted in ascending order', async () => {
    const attachment1 = { ...makeQuestionAttachment({ questionId }), createdAt: new Date('2023-01-02') }
    const attachment2 = { ...makeQuestionAttachment({ questionId }), createdAt: new Date('2023-01-03') }
    const attachment3 = { ...makeQuestionAttachment({ questionId }), createdAt: new Date('2023-01-01') }
    const paginatedAttachments = makePaginatedResponse(1, 3, 3, [attachment3, attachment1, attachment2], 'asc')
    const httpRequest = makeHttpRequest(questionId, 1, 10, 'asc')
    vi.spyOn(fetchQuestionAttachmentsUseCase, 'execute').mockResolvedValue(paginatedAttachments)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 1,
      pageSize: 3,
      totalItems: 3,
      totalPages: 1,
      items: [attachment3, attachment1, attachment2],
      order: 'asc'
    })
  })
})
