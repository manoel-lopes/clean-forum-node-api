import type { UseCase } from '@/core/application/use-case'
import { JWTService } from '@/infra/auth/jwt/jwt-service'
import { UseCaseStub } from '@/infra/doubles/use-case.stub'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { CommentOnQuestionController } from './comment-on-question.controller'

vi.mock('@/lib/env', () => ({
  env: {
    NODE_ENV: 'development',
    JWT_SECRET: 'any_secret'
  }
}))

describe('CommentOnQuestionController', () => {
  let sut: CommentOnQuestionController
  let commentOnQuestionUseCase: UseCase
  const httpRequest = {
    body: {
      questionId: 'any_question_id',
      content: 'any_comment_content',
    },
    headers: {
      authorization: 'Bearer any_token'
    }
  }

  beforeEach(() => {
    commentOnQuestionUseCase = new UseCaseStub()
    sut = new CommentOnQuestionController(commentOnQuestionUseCase)
    vi.spyOn(JWTService, 'decodeToken').mockReturnValue({ sub: 'any_user_id' })
  })

  it('should return 404 code and a not found error response if the question is not found', async () => {
    vi.spyOn(commentOnQuestionUseCase, 'execute').mockRejectedValue(
      new ResourceNotFoundError('Question')
    )

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Question not found',
    })
  })

  it('should throw an unknown error response if an unexpected error occurs', async () => {
    const error = new Error('any_error')
    vi.spyOn(commentOnQuestionUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return a created response on successful comment creation', async () => {
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(201)
  })
})
