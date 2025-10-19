import type { UseCase } from '@/core/domain/application/use-case'
import { UseCaseStub } from '@/infra/doubles/use-case.stub'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { UpdateAnswerAttachmentController } from './update-answer-attachment.controller'

describe('UpdateAnswerAttachmentController', () => {
  let sut: UpdateAnswerAttachmentController
  let updateAnswerAttachmentUseCase: UseCase
  const httpRequest = {
    body: {
      title: 'updated_title',
      url: 'https://example.com/updated-file.pdf',
    },
    params: {
      attachmentId: 'any_attachment_id',
    },
  }

  beforeEach(() => {
    updateAnswerAttachmentUseCase = new UseCaseStub()
    sut = new UpdateAnswerAttachmentController(updateAnswerAttachmentUseCase)
  })

  it('should return 404 code and a not found error response if the attachment is not found', async () => {
    vi.spyOn(updateAnswerAttachmentUseCase, 'execute').mockRejectedValue(new ResourceNotFoundError('Attachment'))

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Attachment not found',
    })
  })

  it('should propagate unexpected errors', async () => {
    const error = new Error('any_error')
    vi.spyOn(updateAnswerAttachmentUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 200 and the updated attachment on success', async () => {
    const mockAttachment = {
      id: 'any_attachment_id',
      title: 'updated_title',
      url: 'https://example.com/updated-file.pdf',
      answerId: 'any_answer_id',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    vi.spyOn(updateAnswerAttachmentUseCase, 'execute').mockResolvedValue(mockAttachment)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(mockAttachment)
  })
})
