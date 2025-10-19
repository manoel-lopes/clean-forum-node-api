import type { QuestionAttachmentsRepository } from '@/domain/application/repositories/question-attachments.repository'
import { InMemoryQuestionAttachmentsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-question-attachments.repository'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { makeQuestionAttachment } from '@/shared/util/factories/domain/make-question-attachment'
import { createAndSave, expectEntityToMatch } from '@/shared/util/test/test-helpers'
import { UpdateQuestionAttachmentUseCase } from './update-question-attachment.usecase'

describe('UpdateQuestionAttachmentUseCase', () => {
  let sut: UpdateQuestionAttachmentUseCase
  let questionAttachmentsRepository: QuestionAttachmentsRepository

  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    sut = new UpdateQuestionAttachmentUseCase(questionAttachmentsRepository)
  })

  it('should throw error when attachment does not exist', async () => {
    const request = {
      attachmentId: 'non-existent-id',
      title: 'Updated Title',
    }

    await expect(sut.execute(request)).rejects.toThrow(new ResourceNotFoundError('Attachment'))
  })

  it('should update attachment title', async () => {
    const attachment = await createAndSave(makeQuestionAttachment, questionAttachmentsRepository, {
      title: 'Original Title',
      url: 'https://example.com/original.pdf',
    })

    const result = await sut.execute({
      attachmentId: attachment.id,
      title: 'Updated Title',
    })

    expectEntityToMatch(result, {
      id: attachment.id,
      title: 'Updated Title',
      url: 'https://example.com/original.pdf',
    })
  })

  it('should update attachment link', async () => {
    const attachment = await createAndSave(makeQuestionAttachment, questionAttachmentsRepository, {
      title: 'Document Title',
      url: 'https://example.com/original.pdf',
    })

    const result = await sut.execute({
      attachmentId: attachment.id,
      url: 'https://example.com/updated.pdf',
    })

    expectEntityToMatch(result, {
      id: attachment.id,
      title: 'Document Title',
      url: 'https://example.com/updated.pdf',
    })
  })

  it('should update both title and link', async () => {
    const attachment = await createAndSave(makeQuestionAttachment, questionAttachmentsRepository)

    const result = await sut.execute({
      attachmentId: attachment.id,
      title: 'New Title',
      url: 'https://example.com/new.pdf',
    })

    expectEntityToMatch(result, {
      id: attachment.id,
      title: 'New Title',
      url: 'https://example.com/new.pdf',
    })
  })
})
