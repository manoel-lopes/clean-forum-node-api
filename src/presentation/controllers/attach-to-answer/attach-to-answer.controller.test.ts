import type { UseCase } from '@/core/domain/application/use-case'
import { UseCaseStub } from '@/infra/doubles/use-case.stub'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { AttachToAnswerController } from './attach-to-answer.controller'

describe('AttachToAnswerController', () => {
  let sut: AttachToAnswerController
  let attachToAnswerUseCase: UseCase
  const httpRequest = {
    body: {
      title: 'any_title',
      link: 'https://example.com/file.pdf',
    },
    params: {
      answerId: 'any_answer_id',
    },
  }

  beforeEach(() => {
    attachToAnswerUseCase = new UseCaseStub()
    sut = new AttachToAnswerController(attachToAnswerUseCase)
  })

  it('should return 404 code and a not found error response if the answer is not found', async () => {
    vi.spyOn(attachToAnswerUseCase, 'execute').mockRejectedValue(new ResourceNotFoundError('Answer'))

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Answer not found',
    })
  })

  it('should propagate unexpected errors', async () => {
    const error = new Error('any_error')
    vi.spyOn(attachToAnswerUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 201 and the created attachment on success', async () => {
    const mockAttachment = {
      id: 'any_attachment_id',
      title: 'any_title',
      link: 'https://example.com/file.pdf',
      answerId: 'any_answer_id',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    vi.spyOn(attachToAnswerUseCase, 'execute').mockResolvedValue(mockAttachment)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(201)
    expect(httpResponse.body).toEqual(mockAttachment)
  })
})
