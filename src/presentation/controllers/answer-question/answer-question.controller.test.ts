import type { UseCase } from '@/core/domain/application/use-case'
import { JWTService } from '@/infra/auth/jwt/jwt-service'
import { UseCaseStub } from '@/infra/doubles/use-case.stub'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { AnswerQuestionController } from './answer-question.controller'

vi.mock('@/lib/env', () => ({
  env: {
    NODE_ENV: 'development',
    JWT_SECRET: 'any_secret',
  },
}))

describe('AnswerQuestionController', () => {
  let sut: AnswerQuestionController
  let answerQuestionUseCase: UseCase
  const httpRequest = {
    body: {
      questionId: 'any_question_id',
      content: 'any_content',
    },
    headers: {
      authorization: 'Bearer any_token',
    },
  }

  beforeEach(() => {
    answerQuestionUseCase = new UseCaseStub()
    sut = new AnswerQuestionController(answerQuestionUseCase)
    vi.spyOn(JWTService, 'decodeToken').mockReturnValue({ sub: 'any_user_id' })
  })

  it('should return 404 code and an not found error response if the author is not found', async () => {
    vi.spyOn(answerQuestionUseCase, 'execute').mockRejectedValue(new ResourceNotFoundError('User'))

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'User not found',
    })
  })

  it('should propagate unexpected errors', async () => {
    const error = new Error('any_error')
    vi.spyOn(answerQuestionUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return a created response on the creation of an answer', async () => {
    vi.spyOn(answerQuestionUseCase, 'execute').mockImplementation(async () => {})

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(201)
    expect(answerQuestionUseCase.execute).toHaveBeenCalledWith({
      authorId: 'any_user_id',
      questionId: 'any_question_id',
      content: 'any_content',
    })
  })
})
