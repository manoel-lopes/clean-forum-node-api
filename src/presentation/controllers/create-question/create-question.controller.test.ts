import type { UseCase } from '@/core/application/use-case'

import { UseCaseStub } from '@/infra/doubles/stubs/use-case.stub'

import { QuestionWithTitleAlreadyRegisteredError } from '@/application/usecases/create-question/errors/question-with-title-already-registered.error'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'

import { conflict, created, notFound } from '@/presentation/helpers/http-helpers'

import { CreateQuestionController } from './create-question.controller'

describe('CreateQuestionController', () => {
  let sut: CreateQuestionController
  let createQuestionUseCase: UseCase

  beforeEach(() => {
    createQuestionUseCase = new UseCaseStub()
    sut = new CreateQuestionController(createQuestionUseCase)
  })

  const httpRequest = {
    body: {
      title: 'any_title',
      content: 'any_content',
      authorId: 'any_author_id'
    }
  }

  it('should return a conflict error response if the question title is already registered', async () => {
    const error = new QuestionWithTitleAlreadyRegisteredError()
    vi.spyOn(createQuestionUseCase, 'execute').mockRejectedValue(error)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(conflict(error))
  })

  it('should return a not found error response if the author is not found', async () => {
    const error = new ResourceNotFoundError('User')
    vi.spyOn(createQuestionUseCase, 'execute').mockRejectedValue(error)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(notFound(error))
  })

  it('should return an unknown error response if an unexpect error occur', async () => {
    const error = new Error('any_error')

    vi.spyOn(createQuestionUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should call use case with correct params', async () => {
    const executeSpy = vi.spyOn(createQuestionUseCase, 'execute')

    await sut.handle(httpRequest)

    expect(executeSpy).toHaveBeenCalledWith({
      title: 'any_title',
      content: 'any_content',
      authorId: 'any_author_id'
    })
  })

  it('should return a created response on the creation of a question', async () => {
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(created())
  })
})
