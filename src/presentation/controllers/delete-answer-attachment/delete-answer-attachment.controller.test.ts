import type { UseCase } from '@/core/domain/application/use-case'
import { UseCaseStub } from '@/infra/doubles/use-case.stub'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { DeleteAnswerAttachmentController } from './delete-answer-attachment.controller'

describe('DeleteAnswerAttachmentController', () => {
  let sut: DeleteAnswerAttachmentController
  let deleteAnswerAttachmentUseCase: UseCase
  const httpRequest = {
    params: {
      attachmentId: 'any_attachment_id'
    }
  }

  beforeEach(() => {
    deleteAnswerAttachmentUseCase = new UseCaseStub()
    sut = new DeleteAnswerAttachmentController(deleteAnswerAttachmentUseCase)
  })

  it('should return 404 code and a not found error response if the attachment is not found', async () => {
    vi.spyOn(deleteAnswerAttachmentUseCase, 'execute').mockRejectedValue(
      new ResourceNotFoundError('Attachment')
    )

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Attachment not found',
    })
  })

  it('should propagate unexpected errors', async () => {
    const error = new Error('any_error')
    vi.spyOn(deleteAnswerAttachmentUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 204 on successful attachment deletion', async () => {
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(204)
  })
})
