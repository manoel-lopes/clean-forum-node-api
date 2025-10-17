import type { QuestionAttachmentsRepository } from '@/domain/application/repositories/question-attachments.repository'
import { InMemoryQuestionAttachmentsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-question-attachments.repository'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { makeQuestionAttachment } from '@/shared/util/factories/domain/make-question-attachment'
import { createAndSave, expectEntityToBeDeleted } from '@/shared/util/test/test-helpers'
import { DeleteQuestionAttachmentUseCase } from './delete-question-attachment.usecase'

describe('DeleteQuestionAttachmentUseCase', () => {
  let sut: DeleteQuestionAttachmentUseCase
  let questionAttachmentsRepository: QuestionAttachmentsRepository

  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    sut = new DeleteQuestionAttachmentUseCase(questionAttachmentsRepository)
  })

  it('should throw error when attachment does not exist', async () => {
    const request = { attachmentId: 'non-existent-id' }

    await expect(sut.execute(request)).rejects.toThrow(new ResourceNotFoundError('Attachment'))
  })

  it('should delete an attachment', async () => {
    const attachment = await createAndSave(makeQuestionAttachment, questionAttachmentsRepository)

    await sut.execute({ attachmentId: attachment.id })

    await expectEntityToBeDeleted(questionAttachmentsRepository, attachment.id)
  })
})
