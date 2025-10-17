import type { UseCase } from '@/core/domain/application/use-case'
import { UseCaseStub } from '@/infra/doubles/use-case.stub'
import { makeAnswerAttachment } from '@/shared/util/factories/domain/make-answer-attachment'
import { FetchAnswerAttachmentsController } from './fetch-answer-attachments.controller'

function makePaginatedResponse<T>(
  page: number,
  pageSize: number,
  totalItems: number,
  items: T[],
  order: 'asc' | 'desc' = 'desc',
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

function makeAttachments(quantity: number, answerId: string) {
  const attachments = []
  for (let i = 0; i < quantity; i++) {
    attachments.push(makeAnswerAttachment({ answerId }))
  }
  return attachments
}

function makeHttpRequest(answerId: string, page?: number, pageSize?: number, order?: 'asc' | 'desc') {
  return {
    params: { answerId },
    query: { page, pageSize, order },
  }
}

describe('FetchAnswerAttachmentsController', () => {
  let fetchAnswerAttachmentsUseCase: UseCase
  let sut: FetchAnswerAttachmentsController
  const answerId = 'any_answer_id'

  beforeEach(() => {
    fetchAnswerAttachmentsUseCase = new UseCaseStub()
    sut = new FetchAnswerAttachmentsController(fetchAnswerAttachmentsUseCase)
  })

  it('should propagate unexpected errors', async () => {
    const httpRequest = makeHttpRequest(answerId, 1, 10)
    const error = new Error('any_error')
    vi.spyOn(fetchAnswerAttachmentsUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 200 with empty array when no attachments are found', async () => {
    const paginatedAttachments = makePaginatedResponse(1, 10, 0, [], 'desc')
    const httpRequest = makeHttpRequest(answerId, 1, 10)
    vi.spyOn(fetchAnswerAttachmentsUseCase, 'execute').mockResolvedValue(paginatedAttachments)

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
    const attachments = makeAttachments(1, answerId)
    const paginatedAttachments = makePaginatedResponse(1, 10, 1, attachments, 'desc')
    const httpRequest = makeHttpRequest(answerId)
    vi.spyOn(fetchAnswerAttachmentsUseCase, 'execute').mockResolvedValue(paginatedAttachments)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 1,
      pageSize: 10,
      totalItems: 1,
      totalPages: 1,
      items: attachments,
      order: 'desc',
    })
  })

  it('should return 200 with correct pagination', async () => {
    const attachments = makeAttachments(3, answerId)
    const paginatedAttachments = makePaginatedResponse(2, 3, 11, attachments, 'desc')
    const httpRequest = makeHttpRequest(answerId, 2, 3)
    vi.spyOn(fetchAnswerAttachmentsUseCase, 'execute').mockResolvedValue(paginatedAttachments)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 2,
      pageSize: 3,
      totalItems: 11,
      totalPages: 4,
      items: attachments,
      order: 'desc',
    })
  })

  it('should return 200 with attachments sorted in ascending order', async () => {
    const attachment1 = { ...makeAnswerAttachment({ answerId }), createdAt: new Date('2023-01-02') }
    const attachment2 = { ...makeAnswerAttachment({ answerId }), createdAt: new Date('2023-01-03') }
    const attachment3 = { ...makeAnswerAttachment({ answerId }), createdAt: new Date('2023-01-01') }
    const paginatedAttachments = makePaginatedResponse(1, 3, 3, [attachment3, attachment1, attachment2], 'asc')
    const httpRequest = makeHttpRequest(answerId, 1, 10, 'asc')
    vi.spyOn(fetchAnswerAttachmentsUseCase, 'execute').mockResolvedValue(paginatedAttachments)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      page: 1,
      pageSize: 3,
      totalItems: 3,
      totalPages: 1,
      items: [attachment3, attachment1, attachment2],
      order: 'asc',
    })
  })
})
