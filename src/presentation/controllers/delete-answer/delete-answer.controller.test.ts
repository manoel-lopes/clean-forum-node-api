import type { UseCase } from '@/core/application/use-case'
import { JWTService } from '@/infra/auth/jwt/jwt-service'
import { UseCaseStub } from '@/infra/doubles/use-case.stub'
import { DeleteAnswerController } from './delete-answer.controller'
import { NotAuthorError } from '@/shared/application/errors/not-author.error'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'

vi.mock('@/lib/env', () => ({
  env: {
    NODE_ENV: 'development',
    JWT_SECRET: 'any_secret'
  }
}))

describe('DeleteAnswerController', () => {
  let sut: DeleteAnswerController
  let deleteAnswerUseCase: UseCase
  const httpRequest = {
    params: {
      id: 'any_id'
    },
    headers: {
      authorization: 'Bearer any_token'
    }
  }

  beforeEach(() => {
    deleteAnswerUseCase = new UseCaseStub()
    sut = new DeleteAnswerController(deleteAnswerUseCase)
    vi.spyOn(JWTService, 'decodeToken').mockReturnValue({ sub: 'any_user_id' })
  })

  it('should return 404 code and a not found error response if the answer is not found', async () => {
    vi.spyOn(deleteAnswerUseCase, 'execute').mockRejectedValue(
      new ResourceNotFoundError('Answer')
    )

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Answer not found',
    })
  })

  it('should return 403 and a forbidden error response if the user is not the author', async () => {
    vi.spyOn(deleteAnswerUseCase, 'execute').mockRejectedValue(
      new NotAuthorError('answer')
    )

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(403)
    expect(httpResponse.body).toEqual({
      error: 'Forbidden',
      message: 'The user is not the author of the answer',
    })
  })

  it('should propagate unexpected errors', async () => {
    const error = new Error('any_error')
    vi.spyOn(deleteAnswerUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 204 on successful answer deletion', async () => {
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(204)
  })
})
