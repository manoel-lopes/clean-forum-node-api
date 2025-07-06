import type { UseCase } from '@/core/application/use-case'

import { UseCaseStub } from '@/infra/doubles/stubs/use-case.stub'

import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'

import { created, notFound } from '@/presentation/helpers/http-helpers'

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

  it('should return a not found error response if the author is not found', async () => {
    const error = new ResourceNotFoundError('User')
    vi.spyOn(answerQuestionUseCase, 'execute').mockRejectedValue(error)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(notFound(error))
  })

  it('should return an unknown error response if an unexpect error occur', async () => {
    const error = new Error('any_error')

    vi.spyOn(answerQuestionUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should call AnswerQuestionUseCase with correct params', async () => {
    const executeSpy = vi.spyOn(answerQuestionUseCase, 'execute')

    await sut.handle(httpRequest)

    expect(executeSpy).toHaveBeenCalledWith({
      questionId: 'any_question_id',
      content: 'any_content',
      authorId: 'any_author_id'
    })
  })

  it('should return a created response on the creation of an answer', async () => {
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(created())
  })
})
