import type { AnswerAttachmentsRepository } from '@/domain/application/repositories/answer-attachments.repository'
import { InMemoryAnswerAttachmentsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-answer-attachments.repository'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { makeAnswerAttachment } from '@/shared/util/factories/domain/make-answer-attachment'
import { createAndSave, expectEntityToBeDeleted } from '@/shared/util/test/test-helpers'
import { DeleteAnswerAttachmentUseCase } from './delete-answer-attachment.usecase'

describe('DeleteAnswerAttachmentUseCase', () => {
  let sut: DeleteAnswerAttachmentUseCase
  let answerAttachmentsRepository: AnswerAttachmentsRepository

  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    sut = new DeleteAnswerAttachmentUseCase(answerAttachmentsRepository)
  })

  it('should throw error when attachment does not exist', async () => {
    const request = { attachmentId: 'non-existent-id' }

    await expect(sut.execute(request)).rejects.toThrow(new ResourceNotFoundError('Attachment'))
  })

  it('should delete an attachment', async () => {
    const attachment = await createAndSave(makeAnswerAttachment, answerAttachmentsRepository)

    await sut.execute({ attachmentId: attachment.id })

    await expectEntityToBeDeleted(answerAttachmentsRepository, attachment.id)
  })
})
