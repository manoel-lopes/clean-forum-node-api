import type { UseCase } from '@/core/application/use-case'
import { JWTService } from '@/infra/auth/jwt/jwt-service'
import { UseCaseStub } from '@/infra/doubles/use-case.stub'
import { QuestionWithTitleAlreadyRegisteredError } from '@/application/usecases/create-question/errors/question-with-title-already-registered.error'
import { CreateQuestionController } from './create-question.controller'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'

vi.mock('@/lib/env', () => ({
  env: {
    NODE_ENV: 'development',
    JWT_SECRET: 'any_secret'
  }
}))

describe('CreateQuestionController', () => {
  let sut: CreateQuestionController
  let createQuestionUseCase: UseCase
  const httpRequest = {
    body: {
      title: 'any_title',
      content: 'any_content',
    },
    headers: {
      authorization: 'Bearer any_token'
    }
  }

  beforeEach(() => {
    createQuestionUseCase = new UseCaseStub()
    sut = new CreateQuestionController(createQuestionUseCase)
    vi.spyOn(JWTService, 'decodeToken').mockReturnValue({ sub: 'any_user_id' })
  })

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

  it('should propagate unexpected errors', async () => {
    const error = new Error('any_error')
    vi.spyOn(createQuestionUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 201 and an created response on the creation of a question', async () => {
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(201)
  })
})
