import type { UseCase } from '@/core/domain/application/use-case'
import { JWTService } from '@/infra/auth/jwt/jwt-service'
import { UseCaseStub } from '@/infra/doubles/use-case.stub'
import { NotAuthorError } from '@/shared/application/errors/not-author.error'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { DeleteCommentController } from './delete-comment.controller'

vi.mock('@/lib/env', () => ({
  env: {
    NODE_ENV: 'development',
    JWT_SECRET: 'any_secret'
  }
}))

describe('DeleteCommentController', () => {
  let sut: DeleteCommentController
  let deleteCommentUseCase: UseCase
  const httpRequest = {
    params: {
      commentId: 'any_comment_id'
    },
    headers: {
      authorization: 'Bearer any_token'
    }
  }

  beforeEach(() => {
    deleteCommentUseCase = new UseCaseStub()
    sut = new DeleteCommentController(deleteCommentUseCase)
    vi.spyOn(JWTService, 'decodeToken').mockReturnValue({ sub: 'any_user_id' })
  })

  it('should return 404 code and a not found error response if the comment is not found', async () => {
    vi.spyOn(deleteCommentUseCase, 'execute').mockRejectedValue(
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
    vi.spyOn(deleteCommentUseCase, 'execute').mockRejectedValue(
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
    vi.spyOn(deleteCommentUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return a no content response on successful comment deletion', async () => {
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(204)
  })

  it('should return a no content response on successful comment deletion', async () => {
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(204)
  })
})
