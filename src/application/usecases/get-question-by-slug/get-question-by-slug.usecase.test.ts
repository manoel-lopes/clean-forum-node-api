import { InMemoryQuestionsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-questions.repository'

import type { QuestionsRepository } from '@/application/repositories/questions.repository'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'

import { makeQuestion } from '@/util/factories/domain/make-question'

import {
  type GetQuestionBySlugRequest,
  GetQuestionBySlugUseCase
} from './get-question-by-slug.usecase'

describe('GetQuestionBySlugUseCase', () => {
  let sut: GetQuestionBySlugUseCase
  let questionRepository: QuestionsRepository

  const request: GetQuestionBySlugRequest = { slug: 'any-slug' }

  beforeEach(() => {
    questionRepository = new InMemoryQuestionsRepository()
    sut = new GetQuestionBySlugUseCase(questionRepository)
  })

  it('should not get a nonexistent question', async () => {
    await expect(sut.execute({
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
  })
})
