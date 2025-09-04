import type { UseCase } from '@/core/application/use-case'
import { JWTService } from '@/infra/auth/jwt/jwt-service'
import { UseCaseStub } from '@/infra/doubles/use-case.stub'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { CommentOnAnswerController } from './comment-on-answer.controller'

vi.mock('@/lib/env', () => ({
  env: {
    NODE_ENV: 'development',
    JWT_SECRET: 'any_secret'
  }
}))

describe('CommentOnAnswerController', () => {
  let sut: CommentOnAnswerController
  let commentOnAnswerUseCase: UseCase
  const httpRequest = {
    body: {
      answerId: 'any_answer_id',
      content: 'any_comment_content',
    },
    headers: {
      authorization: 'Bearer any_token'
    }
  }

  beforeEach(() => {
    commentOnAnswerUseCase = new UseCaseStub()
    sut = new CommentOnAnswerController(commentOnAnswerUseCase)
    vi.spyOn(JWTService, 'decodeToken').mockReturnValue({ sub: 'any_user_id' })
  })

  it('should return 404 code and a not found error response if the answer is not found', async () => {
    vi.spyOn(commentOnAnswerUseCase, 'execute').mockRejectedValue(
      new ResourceNotFoundError('Answer')
    )

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Answer not found',
    })
  })

  it('should propagate unexpected errors',, async () => {
    const error = new Error('any_error')
    vi.spyOn(commentOnAnswerUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return a created response on successful comment creation', async () => {
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(201)
  })
})
