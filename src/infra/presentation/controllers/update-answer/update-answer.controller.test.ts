import { makeAnswerData } from 'tests/factories/domain/make-answer'
import { UseCaseStub } from 'tests/helpers/domain/application/use-case.stub'
import type { UseCase } from '@/core/domain/application/use-case'
import { JWTService } from '@/infra/auth/jwt/jwt-service'
import { NotAuthorError } from '@/shared/application/errors/not-author.error'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { UpdateAnswerController } from './update-answer.controller'

vi.mock('@/lib/env', () => ({
  env: {
    NODE_ENV: 'development',
    JWT_SECRET: 'any_secret',
  },
}))

describe('UpdateAnswerController', () => {
  let sut: UpdateAnswerController
  let updateAnswerUseCase: UseCase
  const httpRequest = {
    body: {
      content: 'updated_content',
    },
    params: {
      answerId: 'any_answer_id',
    },
    headers: {
      authorization: 'Bearer any_token',
    },
  }

  beforeEach(() => {
    updateAnswerUseCase = new UseCaseStub()
    sut = new UpdateAnswerController(updateAnswerUseCase)
    vi.spyOn(JWTService, 'decodeToken').mockReturnValue({ sub: 'any_user_id' })
  })

  it('should return 404 code and a not found error response if the answer is not found', async () => {
    vi.spyOn(updateAnswerUseCase, 'execute').mockRejectedValue(new ResourceNotFoundError('Answer'))

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Answer not found',
    })
  })

  it('should return 404 code and a not found error response if the user is not the author', async () => {
    vi.spyOn(updateAnswerUseCase, 'execute').mockRejectedValue(new NotAuthorError('answer'))

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'The user is not the author of the answer',
    })
  })

  it('should propagate unexpected errors', async () => {
    const error = new Error('any_error')
    vi.spyOn(updateAnswerUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 200 and the updated answer on success', async () => {
    const mockAnswer = {
      ...makeAnswerData({ authorId: 'any_user_id' }),
      id: 'any_answer_id',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    vi.spyOn(updateAnswerUseCase, 'execute').mockResolvedValue(mockAnswer)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({ answer: mockAnswer })
  })
})
