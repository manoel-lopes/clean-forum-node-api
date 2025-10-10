import type { UseCase } from '@/core/domain/application/use-case'
import { JWTService } from '@/infra/auth/jwt/jwt-service'
import { UseCaseStub } from '@/infra/doubles/use-case.stub'
import { NotAuthorError } from '@/shared/application/errors/not-author.error'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { DeleteQuestionController } from './delete-question.controller'

vi.mock('@/lib/env', () => ({
  env: {
    NODE_ENV: 'development',
    JWT_SECRET: 'any_secret'
  }
}))

describe('DeleteQuestionController', () => {
  let sut: DeleteQuestionController
  let deleteQuestionUseCase: UseCase
  const httpRequest = {
    params: {
      id: 'any_id'
    },
    headers: {
      authorization: 'Bearer any_token',
    },
  }

  beforeEach(() => {
    deleteQuestionUseCase = new UseCaseStub()
    sut = new DeleteQuestionController(deleteQuestionUseCase)
    vi.spyOn(JWTService, 'decodeToken').mockReturnValue({ sub: 'any_user_id' })
  })

  it('should return 404 code and a not found error response if the question is not found', async () => {
    vi.spyOn(deleteQuestionUseCase, 'execute').mockRejectedValue(
      new ResourceNotFoundError('Question')
    )

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Question not found',
    })
  })

  it('should return 403 and a forbidden error response if the user is not the author', async () => {
    vi.spyOn(deleteQuestionUseCase, 'execute').mockRejectedValue(
      new NotAuthorError('question')
    )

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual({
      error: 'Forbidden',
      message: 'The user is not the author of the question',
    })
  })

  it('should propagate unexpected errors', async () => {
    const error = new Error('any_error')
    vi.spyOn(deleteQuestionUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 204 on successful question deletion', async () => {
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(204)
  })
})
