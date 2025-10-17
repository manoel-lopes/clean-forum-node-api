import type { UseCase } from '@/core/domain/application/use-case'
import { JWTService } from '@/infra/auth/jwt/jwt-service'
import { UseCaseStub } from '@/infra/doubles/use-case.stub'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { makeQuestionComment } from '@/shared/util/factories/domain/make-question-comment'
import { CommentOnQuestionController } from './comment-on-question.controller'

vi.mock('@/lib/env', () => ({
  env: {
    NODE_ENV: 'development',
    JWT_SECRET: 'any_secret',
  },
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
      authorization: 'Bearer any_token',
    },
  }

  beforeEach(() => {
    commentOnQuestionUseCase = new UseCaseStub()
    sut = new CommentOnQuestionController(commentOnQuestionUseCase)
    vi.spyOn(JWTService, 'decodeToken').mockReturnValue({ sub: 'any_user_id' })
  })

  it('should return 404 code and a not found error response if the question is not found', async () => {
    vi.spyOn(commentOnQuestionUseCase, 'execute').mockRejectedValue(new ResourceNotFoundError('Question'))

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Question not found',
    })
  })

  it('should propagate unexpected errors', async () => {
    const error = new Error('any_error')
    vi.spyOn(commentOnQuestionUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return a created response on successful comment creation', async () => {
    const commentData = makeQuestionComment()
    vi.spyOn(commentOnQuestionUseCase, 'execute').mockResolvedValue(commentData)
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(201)
    expect(httpResponse.body).toEqual({
      id: commentData.id,
      content: commentData.content,
      authorId: commentData.authorId,
      questionId: commentData.questionId,
      createdAt: commentData.createdAt,
      updatedAt: commentData.updatedAt,
    })
  })
})
