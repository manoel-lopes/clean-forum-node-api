import type { AnswerAttachmentsRepository } from '@/domain/application/repositories/answer-attachments.repository'
import { InMemoryAnswerAttachmentsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-answer-attachments.repository'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { makeAnswerAttachment } from '@/shared/util/factories/domain/make-answer-attachment'
import { createAndSave, expectEntityToMatch } from '@/shared/util/test/test-helpers'
import { UpdateAnswerAttachmentUseCase } from './update-answer-attachment.usecase'

describe('UpdateAnswerAttachmentUseCase', () => {
  let sut: UpdateAnswerAttachmentUseCase
  let answerAttachmentsRepository: AnswerAttachmentsRepository

  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    sut = new UpdateAnswerAttachmentUseCase(answerAttachmentsRepository)
  })

  it('should throw error when attachment does not exist', async () => {
    const request = {
      attachmentId: 'non-existent-id',
      title: 'Updated Title',
    }

    await expect(sut.execute(request)).rejects.toThrow(new ResourceNotFoundError('Attachment'))
  })

  it('should update attachment title', async () => {
    const attachment = await createAndSave(makeAnswerAttachment, answerAttachmentsRepository, {
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
    const attachment = await createAndSave(makeAnswerAttachment, answerAttachmentsRepository, {
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
    const attachment = await createAndSave(makeAnswerAttachment, answerAttachmentsRepository)

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
