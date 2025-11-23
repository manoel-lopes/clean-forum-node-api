import { UseCaseStub } from 'tests/helpers/domain/application/use-case.stub'
import type { UseCase } from '@/core/domain/application/use-case'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { DeleteQuestionAttachmentController } from './delete-question-attachment.controller'

describe('DeleteQuestionAttachmentController', () => {
  let sut: DeleteQuestionAttachmentController
  let deleteQuestionAttachmentUseCase: UseCase
  const httpRequest = {
    params: {
      attachmentId: 'any_attachment_id',
    },
  }

  beforeEach(() => {
    deleteQuestionAttachmentUseCase = new UseCaseStub()
    sut = new DeleteQuestionAttachmentController(deleteQuestionAttachmentUseCase)
  })

  it('should return 404 code and a not found error response if the attachment is not found', async () => {
    vi.spyOn(deleteQuestionAttachmentUseCase, 'execute').mockRejectedValue(new ResourceNotFoundError('Attachment'))

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Attachment not found',
    })
  })

  it('should propagate unexpected errors', async () => {
    const error = new Error('any_error')
    vi.spyOn(deleteQuestionAttachmentUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 204 on successful attachment deletion', async () => {
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(204)
  })
})
