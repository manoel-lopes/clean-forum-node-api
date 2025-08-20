import type { UseCase } from '@/core/application/use-case'
import { UseCaseStub } from '@/infra/doubles/use-case.stub'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { GetQuestionBySlugController } from './get-question-by-slug.controller'

describe('GetQuestionBySlugController', () => {
  let sut: GetQuestionBySlugController
  let getQuestionBySlugUseCase: UseCase

  beforeEach(() => {
    getQuestionBySlugUseCase = new UseCaseStub()
    sut = new GetQuestionBySlugController(getQuestionBySlugUseCase)
  })
  const httpRequest = {
    params: {
      slug: 'any_slug'
    },
    query: {
      page: 1,
      pageSize: 20,
      order: 'desc'
    }
  }
  it('should return 404 code and a not found error response if the question is not found', async () => {
    vi.spyOn(getQuestionBySlugUseCase, 'execute').mockRejectedValue(
      new ResourceNotFoundError('Question')
    )
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(404)
    expect(httpResponse.body).toEqual({
      error: 'Not Found',
      message: 'Question not found',
    })
  })

  it('should throw an an unexpect error', async () => {
    const error = new Error('any_error')
    vi.spyOn(getQuestionBySlugUseCase, 'execute').mockRejectedValue(error)
    await expect(sut.handle(httpRequest)).rejects.toThrow(error)
  })

  it('should return 200 and an ok response with the question data on successful retrieval', async () => {
    const question = {
      id: 'any_id',
      title: 'any_title',
      slug: 'any_slug',
      content: 'any_content',
      authorId: 'any_author_id',
      createdAt: new Date().toISOString()
    }
    vi.spyOn(getQuestionBySlugUseCase, 'execute').mockResolvedValue(question)
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: question.id,
      title: question.title,
      slug: question.slug,
      content: question.content,
      authorId: question.authorId,
      createdAt: question.createdAt
    })
  })
})
