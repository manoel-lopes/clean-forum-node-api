import type { QuestionsRepository } from '@/application/repositories/questions.repository'
import { InMemoryQuestionsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-questions.repository'
import {
  GetQuestionBySlugUseCase
} from './get-question-by-slug.usecase'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { makeQuestion } from '@/shared/util/factories/domain/make-question'

describe('GetQuestionBySlugUseCase', () => {
  let sut: GetQuestionBySlugUseCase
  let questionRepository: QuestionsRepository
  const request = {
    slug: 'any-slug',
    page: 1,
    pageSize: 10,
    order: 'desc' as const
  }

  beforeEach(() => {
    questionRepository = new InMemoryQuestionsRepository()
    sut = new GetQuestionBySlugUseCase(questionRepository)
  })

  it('should not get a nonexistent question', async () => {
    await expect(sut.execute({
      ...request,
      slug: 'any-inexistent-slug'
    })).rejects.toThrowError(new ResourceNotFoundError('Question'))
  })

  it('should get a question using the slug', async () => {
    const question = makeQuestion({ slug: request.slug })
    await questionRepository.save(question)

    const response = await sut.execute(request)

    expect(response.id).toBe(question.id)
    expect(response.content).toBe(question.content)
    expect(response.title).toBe(question.title)
    expect(response.authorId).toBe(question.authorId)
    expect(response.bestAnswerId).toBe(question.bestAnswerId)
    expect(response.createdAt).toBeInstanceOf(Date)
    expect(response.updatedAt).toBeInstanceOf(Date)
    expect(response.slug).toBe('any-slug')
    expect(response.answers).toEqual({
      items: [],
      order: 'desc',
      page: 1,
      pageSize: 0,
      totalItems: 0,
      totalPages: 0,
    })
  })
})
