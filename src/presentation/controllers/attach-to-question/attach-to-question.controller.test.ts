import type { UseCase } from '@/core/domain/application/use-case'
import { UseCaseStub } from '@/infra/doubles/use-case.stub'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { AttachToQuestionController } from './attach-to-question.controller'

describe('AttachToQuestionController', () => {
  let sut: AttachToQuestionController
  let attachToQuestionUseCase: UseCase
  const httpRequest = {
    body: {
      title: 'any_title',
      url: 'https://example.com/file.pdf',
    },
    params: {
      questionId: 'any_question_id',
    },
  }

  beforeEach(() => {
    attachToQuestionUseCase = new UseCaseStub()
    sut = new AttachToQuestionController(attachToQuestionUseCase)
  })

  it('should return 404 code and a not found error response if the question is not found', async () => {
    vi.spyOn(attachToQuestionUseCase, 'execute').mockRejectedValue(new ResourceNotFoundError('Question'))

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Question not found',
    })
  })

  it('should propagate unexpected errors', async () => {
    const error = new Error('any_error')
    vi.spyOn(attachToQuestionUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 201 and the created attachment on success', async () => {
    const mockAttachment = {
      id: 'any_attachment_id',
      title: 'any_title',
      url: 'https://example.com/file.pdf',
      questionId: 'any_question_id',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    vi.spyOn(attachToQuestionUseCase, 'execute').mockResolvedValue(mockAttachment)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(201)
    expect(httpResponse.body).toEqual(mockAttachment)
  })
})
