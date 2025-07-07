import type { UseCase } from '@/core/application/use-case'

import { UseCaseStub } from '@/infra/doubles/stubs/use-case.stub'

import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'

import { AnswerQuestionController } from './answer-question.controller'

describe('AnswerQuestionController', () => {
  let sut: AnswerQuestionController
  let answerQuestionUseCase: UseCase

  beforeEach(() => {
    answerQuestionUseCase = new UseCaseStub()
    sut = new AnswerQuestionController(answerQuestionUseCase)
  })

  const httpRequest = {
    body: {
      questionId: 'any_question_id',
      content: 'any_content',
      authorId: 'any_author_id'
    }
  }

  it('should return 404 and an not found error response if the author is not found', async () => {
    vi.spyOn(answerQuestionUseCase, 'execute').mockRejectedValue(
      new ResourceNotFoundError('User')
    )

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'User not found',
    })
  })

  it('should throw an unknown error response if an unexpect error occur', async () => {
    const error = new Error('any_error')

    vi.spyOn(answerQuestionUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return a created response on the creation of an answer', async () => {
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toEqual(201)
  })
})
