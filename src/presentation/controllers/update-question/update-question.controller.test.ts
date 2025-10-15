import type { UseCase } from '@/core/domain/application/use-case'
import { JWTService } from '@/infra/auth/jwt/jwt-service'
import { UseCaseStub } from '@/infra/doubles/use-case.stub'
import { NotAuthorError } from '@/shared/application/errors/not-author.error'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { UpdateQuestionController } from './update-question.controller'

vi.mock('@/lib/env', () => ({
  env: {
    NODE_ENV: 'development',
    JWT_SECRET: 'any_secret'
  }
}))

describe('UpdateQuestionController', () => {
  let sut: UpdateQuestionController
  let updateQuestionUseCase: UseCase
  const httpRequest = {
    body: {
      title: 'updated_title',
      content: 'updated_content',
    },
    params: {
      questionId: 'any_question_id'
    },
    headers: {
      authorization: 'Bearer any_token'
    }
  }

  beforeEach(() => {
    updateQuestionUseCase = new UseCaseStub()
    sut = new UpdateQuestionController(updateQuestionUseCase)
    vi.spyOn(JWTService, 'decodeToken').mockReturnValue({ sub: 'any_user_id' })
  })

  it('should return 404 code and a not found error response if the question is not found', async () => {
    vi.spyOn(updateQuestionUseCase, 'execute').mockRejectedValue(
      new ResourceNotFoundError('Question')
    )

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Question not found',
    })
  })

  it('should return 404 code and a not found error response if the user is not the author', async () => {
    vi.spyOn(updateQuestionUseCase, 'execute').mockRejectedValue(
      new NotAuthorError('question')
    )

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'The user is not the author of the question',
    })
  })

  it('should propagate unexpected errors', async () => {
    const error = new Error('any_error')
    vi.spyOn(updateQuestionUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 200 and the updated question on success', async () => {
    const mockQuestion = {
      id: 'any_question_id',
      title: 'updated_title',
      content: 'updated_content',
      slug: 'updated-title',
      authorId: 'any_user_id',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    vi.spyOn(updateQuestionUseCase, 'execute').mockResolvedValue(mockQuestion)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({ question: mockQuestion })
  })
})
