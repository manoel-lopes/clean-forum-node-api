import type { QuestionAttachmentsRepository } from '@/domain/application/repositories/question-attachments.repository'
import { InMemoryQuestionAttachmentsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-question-attachments.repository'
import { makeQuestionAttachment } from '@/shared/util/factories/domain/make-question-attachment'
import { createAndSave } from '@/shared/util/test/test-helpers'
import { FetchQuestionAttachmentsUseCase } from './fetch-question-attachments.usecase'

describe('FetchQuestionAttachmentsUseCase', () => {
  let sut: FetchQuestionAttachmentsUseCase
  let questionAttachmentsRepository: QuestionAttachmentsRepository

  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    sut = new FetchQuestionAttachmentsUseCase(questionAttachmentsRepository)
  })

  it('should fetch attachments for a question', async () => {
    const questionId = 'question-123'
    await createAndSave(makeQuestionAttachment, questionAttachmentsRepository, { questionId })
    await createAndSave(makeQuestionAttachment, questionAttachmentsRepository, { questionId })
    await createAndSave(makeQuestionAttachment, questionAttachmentsRepository, { questionId })

    const result = await sut.execute({
      questionId,
      page: 1,
      pageSize: 10,
      order: 'desc'
    })

    expect(result.items).toHaveLength(3)
    expect(result.page).toBe(1)
    expect(result.totalItems).toBe(3)
    expect(result.totalPages).toBe(1)
  })

  it('should return empty list when no attachments exist', async () => {
    const result = await sut.execute({
      questionId: 'question-123',
      page: 1,
      pageSize: 10,
      order: 'desc'
    })

    expect(result.items).toHaveLength(0)
    expect(result.totalItems).toBe(0)
    expect(result.totalPages).toBe(0)
  })
})
