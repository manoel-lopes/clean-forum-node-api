import type { AnswerAttachmentsRepository } from '@/domain/application/repositories/answer-attachments.repository'
import { InMemoryAnswerAttachmentsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-answer-attachments.repository'
import { makeAnswerAttachment } from '@/shared/util/factories/domain/make-answer-attachment'
import { createAndSave } from '@/shared/util/test/test-helpers'
import { FetchAnswerAttachmentsUseCase } from './fetch-answer-attachments.usecase'

describe('FetchAnswerAttachmentsUseCase', () => {
  let sut: FetchAnswerAttachmentsUseCase
  let answerAttachmentsRepository: AnswerAttachmentsRepository

  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    sut = new FetchAnswerAttachmentsUseCase(answerAttachmentsRepository)
  })

  it('should fetch attachments for an answer', async () => {
    const answerId = 'answer-123'
    await createAndSave(makeAnswerAttachment, answerAttachmentsRepository, { answerId })
    await createAndSave(makeAnswerAttachment, answerAttachmentsRepository, { answerId })
    await createAndSave(makeAnswerAttachment, answerAttachmentsRepository, { answerId })

    const result = await sut.execute({
      answerId,
      page: 1,
      pageSize: 10,
      order: 'desc',
    })

    expect(result.items).toHaveLength(3)
    expect(result.page).toBe(1)
    expect(result.totalItems).toBe(3)
    expect(result.totalPages).toBe(1)
  })

  it('should return empty list when no attachments exist', async () => {
    const result = await sut.execute({
      answerId: 'answer-123',
      page: 1,
      pageSize: 10,
      order: 'desc',
    })

    expect(result.items).toHaveLength(0)
    expect(result.totalItems).toBe(0)
    expect(result.totalPages).toBe(0)
  })
})
