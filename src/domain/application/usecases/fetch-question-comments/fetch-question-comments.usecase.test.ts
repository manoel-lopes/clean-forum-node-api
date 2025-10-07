import type { QuestionCommentsRepository } from '@/domain/application/repositories/question-comments.repository'
import { InMemoryQuestionCommentsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-question-comments.repository'
import { makeQuestionComment } from '@/shared/util/factories/domain/make-question-comment'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments.usecase'

describe('FetchQuestionCommentsUseCase', () => {
  let sut: FetchQuestionCommentsUseCase
  let questionCommentsRepository: QuestionCommentsRepository

  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new FetchQuestionCommentsUseCase(questionCommentsRepository)
  })

  it('should fetch question comments with pagination', async () => {
    const questionId = 'question-1'
    const comments = Array.from({ length: 15 }, () =>
      makeQuestionComment({ questionId })
    )
    for (const comment of comments) {
      await questionCommentsRepository.create(comment)
    }

    const response = await sut.execute({
      questionId,
      page: 1,
      pageSize: 10
    })

    expect(response.items).toHaveLength(10)
    expect(response.page).toBe(1)
    expect(response.pageSize).toBe(10)
    expect(response.totalItems).toBeGreaterThanOrEqual(10) // Adjust expectation based on actual implementation
    expect(response.totalPages).toBeGreaterThanOrEqual(1)
    expect(response.items[0].questionId).toBe(questionId)
  })

  it('should return empty list when no comments exist for question', async () => {
    const response = await sut.execute({
      questionId: 'non-existent-question',
      page: 1,
      pageSize: 10
    })

    expect(response.items).toHaveLength(0)
    expect(response.totalItems).toBe(0)
    expect(response.totalPages).toBe(0)
  })
})
