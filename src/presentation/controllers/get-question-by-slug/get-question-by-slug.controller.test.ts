import { makeQuestionData } from 'tests/factories/domain/make-question'
import { UseCaseStub } from 'tests/helpers/domain/application/use-case.stub'
import type { UseCase } from '@/core/domain/application/use-case'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { GetQuestionBySlugController } from './get-question-by-slug.controller'

describe('GetQuestionBySlugController', () => {
  let sut: GetQuestionBySlugController
  let getQuestionBySlugUseCase: UseCase
  const httpRequest = {
    params: {
      slug: 'any_slug',
    },
    query: {
      page: 1,
      pageSize: 20,
      order: 'desc',
    },
  }

  beforeEach(() => {
    getQuestionBySlugUseCase = new UseCaseStub()
    sut = new GetQuestionBySlugController(getQuestionBySlugUseCase)
  })

  it('should return 404 code and a not found error response if the question is not found', async () => {
    vi.spyOn(getQuestionBySlugUseCase, 'execute').mockRejectedValue(new ResourceNotFoundError('Question'))

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Question not found',
    })
  })

  it('should propagate unexpected errors', async () => {
    const error = new Error('any_error')
    vi.spyOn(getQuestionBySlugUseCase, 'execute').mockRejectedValue(error)

    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 200 and an ok response with the question data on successful retrieval', async () => {
    const question = makeQuestionData({ slug: 'any_slug' })
    vi.spyOn(getQuestionBySlugUseCase, 'execute').mockResolvedValue(question)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(question)
  })
})
