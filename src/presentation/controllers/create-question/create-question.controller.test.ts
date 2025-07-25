import type { UseCase } from '@/core/application/use-case'
import { UseCaseStub } from '@/infra/doubles/stubs/use-case.stub'
import { QuestionWithTitleAlreadyRegisteredError } from '@/application/usecases/create-question/errors/question-with-title-already-registered.error'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { CreateQuestionController } from './create-question.controller'

describe('CreateQuestionController', () => {
  let sut: CreateQuestionController
  let createQuestionUseCase: UseCase

  beforeEach(() => {
    createQuestionUseCase = new UseCaseStub()
    sut = new CreateQuestionController(createQuestionUseCase)
  })
  const httpRequest = {
    body: {
      title: 'any_title',
      content: 'any_content',
      authorId: 'any_author_id'
    }
  }

  it('should return 409 code and an conflict error response if the question title is already registered', async () => {
    vi.spyOn(createQuestionUseCase, 'execute').mockRejectedValue(
      new QuestionWithTitleAlreadyRegisteredError()
    )
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(409)
    expect(httpResponse.body).toEqual({
      error: 'Conflict',
      message: 'Question with title already registered',
    })
  })

  it('should return 404 code and an not found error response if the author is not found', async () => {
    vi.spyOn(createQuestionUseCase, 'execute').mockRejectedValue(
      new ResourceNotFoundError('User')
    )
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'User not found',
    })
  })

  it('should throw an unknown error response if an unexpect error occur', async () => {
    const error = new Error('any_error')
    vi.spyOn(createQuestionUseCase, 'execute').mockRejectedValue(error)
    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 201 and an created response on the creation of a question', async () => {
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(201)
  })
})
