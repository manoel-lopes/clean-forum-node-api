import type { UseCase } from '@/core/application/use-case'
import { JWTService } from '@/infra/auth/jwt/jwt-service'
import { UseCaseStub } from '@/infra/doubles/stubs/use-case.stub'
import { NotAuthorError } from '@/application/errors/not-author.error'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { makeQuestion } from '@/util/factories/domain/make-question'
import { ChooseQuestionBestAnswerController } from './choose-question-best-answer.controller'

describe('ChooseQuestionBestAnswerController', () => {
  let sut: ChooseQuestionBestAnswerController
  let chooseQuestionBestAnswerUseCase: UseCase
  const userId = 'any_user_id'
  const token = 'any_token'
  const httpRequest = {
    params: {
      answerId: 'any_answer_id'
    },
    headers: {
      authorization: `Bearer ${token}`,
    },
  }

  vi.mock('@/lib/env', () => ({
    env: {
      NODE_ENV: 'development',
      JWT_SECRET: 'any_secret'
    }
  }))

  beforeEach(() => {
    chooseQuestionBestAnswerUseCase = new UseCaseStub()
    sut = new ChooseQuestionBestAnswerController(chooseQuestionBestAnswerUseCase)
    vi.spyOn(JWTService, 'decodeToken').mockReturnValue({ sub: userId })
  })

  it('should return 404 code and an not found error response if the answer or question is not found', async () => {
    vi.spyOn(chooseQuestionBestAnswerUseCase, 'execute').mockRejectedValue(
      new ResourceNotFoundError('Answer')
    )

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Answer not found'
    })
  })

  it('should return 403 and an forbidden error response if the user is not the author', async () => {
    vi.spyOn(chooseQuestionBestAnswerUseCase, 'execute').mockRejectedValue(
      new NotAuthorError('question')
    )

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.body).toEqual({
      error: 'Forbidden',
      message: 'The user is not the author of the question'
    })
  })

  it('should throw an unknown error response if an unexpect error occur', async () => {
    const error = new Error('any_error')
    vi.spyOn(chooseQuestionBestAnswerUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 200 and an ok response with the updated question data on success', async () => {
    const question = makeQuestion()
    vi.spyOn(chooseQuestionBestAnswerUseCase, 'execute').mockResolvedValue(question)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(question)
  })
})
