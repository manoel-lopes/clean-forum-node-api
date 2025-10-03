import type { UseCase } from '@/core/application/use-case'
import { JWTService } from '@/infra/auth/jwt/jwt-service'
import { UseCaseStub } from '@/infra/doubles/use-case.stub'
import { UpdateCommentController } from './update-comment.controller'
import { NotAuthorError } from '@/shared/application/errors/not-author.error'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { makeComment } from '@/shared/util/factories/domain/make-comment'

vi.mock('@/lib/env', () => ({
  env: {
    NODE_ENV: 'development',
    JWT_SECRET: 'any_secret'
  }
}))

describe('UpdateCommentController', () => {
  let sut: UpdateCommentController
  let updateCommentUseCase: UseCase
  const httpRequest = {
    params: {
      commentId: 'any_comment_id'
    },
    body: {
      content: 'updated_content'
    },
    headers: {
      authorization: 'Bearer any_token'
    }
  }

  beforeEach(() => {
    updateCommentUseCase = new UseCaseStub()
    sut = new UpdateCommentController(updateCommentUseCase)
    vi.spyOn(JWTService, 'decodeToken').mockReturnValue({ sub: 'any_user_id' })
  })

  it('should return 404 code and a not found error response if the comment is not found', async () => {
    vi.spyOn(updateCommentUseCase, 'execute').mockRejectedValue(
      new ResourceNotFoundError('Comment')
    )

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Comment not found',
    })
  })

  it('should return 403 code and a forbidden error response if user is not the comment author', async () => {
    vi.spyOn(updateCommentUseCase, 'execute').mockRejectedValue(
      new NotAuthorError('comment')
    )

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual({
      error: 'Forbidden',
      message: 'The user is not the author of the comment',
    })
  })

  it('should propagate unexpected errors', async () => {
    const error = new Error('any_error')
    vi.spyOn(updateCommentUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return a success response on successful comment update', async () => {
    const comment = makeComment({ content: httpRequest.body.content })
    vi.spyOn(updateCommentUseCase, 'execute').mockResolvedValue(comment)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toHaveProperty('id', comment.id)
    expect(httpResponse.body).toHaveProperty('content', comment.content)
    expect(httpResponse.body).toHaveProperty('authorId', comment.authorId)
    expect(httpResponse.body).toHaveProperty('createdAt', comment.createdAt)
    expect(httpResponse.body).toHaveProperty('updatedAt', comment.updatedAt)
  })
})
