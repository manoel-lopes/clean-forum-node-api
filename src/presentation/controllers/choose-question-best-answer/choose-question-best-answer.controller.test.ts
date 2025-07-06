import type { UseCase } from '@/core/application/use-case'

import { UseCaseStub } from '@/infra/doubles/stubs/use-case.stub'

import { NotAuthorError } from '@/application/errors/not-author.error'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'

import { forbidden, notFound, ok } from '@/presentation/helpers/http-helpers'

import { ChooseQuestionBestAnswerController } from './choose-question-best-answer.controller'

describe('ChooseQuestionBestAnswerController', () => {
  let sut: ChooseQuestionBestAnswerController
  let chooseQuestionBestAnswerUseCase: UseCase

  beforeEach(() => {
    chooseQuestionBestAnswerUseCase = new UseCaseStub()
    sut = new ChooseQuestionBestAnswerController(chooseQuestionBestAnswerUseCase)
  })

  const httpRequest = {
    params: {
      answerId: 'any_answer_id'
    },
    body: {
      authorId: 'any_author_id'
    }
  }

  it('should return a not found error response if the answer or question is not found', async () => {
    const error = new ResourceNotFoundError('Answer')
    vi.spyOn(chooseQuestionBestAnswerUseCase, 'execute').mockRejectedValue(error)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(notFound(error))
  })

  it('should return a forbidden error response if the user is not the author', async () => {
    const error = new NotAuthorError('question')
    vi.spyOn(chooseQuestionBestAnswerUseCase, 'execute').mockRejectedValue(error)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(forbidden(error))
  })

  it('should return an unknown error response if an unexpect error occur', async () => {
    const error = new Error('any_error')

    vi.spyOn(chooseQuestionBestAnswerUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should call the use case with correct params', async () => {
    const executeSpy = vi.spyOn(chooseQuestionBestAnswerUseCase, 'execute')

    await sut.handle(httpRequest)

    expect(executeSpy).toHaveBeenCalledWith({
      answerId: 'any_answer_id',
      authorId: 'any_author_id'
    })
  })

  it('should return an ok response with the updated question on success', async () => {
    const question = {
      id: 'any_question_id',
      title: 'any_title',
      content: 'any_content',
      authorId: 'any_author_id',
      bestAnswerId: 'any_answer_id',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    vi.spyOn(chooseQuestionBestAnswerUseCase, 'execute').mockResolvedValue(question)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(ok(question))
  })
})
