import type { UseCase } from '@/core/domain/application/use-case'
import { UseCaseStub } from '@/infra/doubles/use-case.stub'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { UpdateQuestionAttachmentController } from './update-question-attachment.controller'

describe('UpdateQuestionAttachmentController', () => {
  let sut: UpdateQuestionAttachmentController
  let updateQuestionAttachmentUseCase: UseCase
  const httpRequest = {
    body: {
      title: 'updated_title',
      link: 'https://example.com/updated-file.pdf',
    },
    params: {
      attachmentId: 'any_attachment_id',
    },
  }

  beforeEach(() => {
    updateQuestionAttachmentUseCase = new UseCaseStub()
    sut = new UpdateQuestionAttachmentController(updateQuestionAttachmentUseCase)
  })

  it('should return 404 code and a not found error response if the attachment is not found', async () => {
    vi.spyOn(updateQuestionAttachmentUseCase, 'execute').mockRejectedValue(new ResourceNotFoundError('Attachment'))

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Attachment not found',
    })
  })

  it('should propagate unexpected errors', async () => {
    const error = new Error('any_error')
    vi.spyOn(updateQuestionAttachmentUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 200 and the updated attachment on success', async () => {
    const mockAttachment = {
      id: 'any_attachment_id',
      title: 'updated_title',
      link: 'https://example.com/updated-file.pdf',
      questionId: 'any_question_id',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    vi.spyOn(updateQuestionAttachmentUseCase, 'execute').mockResolvedValue(mockAttachment)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(mockAttachment)
  })
})
