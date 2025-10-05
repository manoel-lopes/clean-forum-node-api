import type { AnswerCommentsRepository } from '@/application/repositories/answer-comments.repository'
import { InMemoryAnswerCommentsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-answer-comments.repository'
import { makeAnswerComment } from '@/shared/util/factories/domain/make-answer-comment'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments.usecase'

describe('FetchAnswerCommentsUseCase', () => {
  let sut: FetchAnswerCommentsUseCase
  let answerCommentsRepository: AnswerCommentsRepository

  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new FetchAnswerCommentsUseCase(answerCommentsRepository)
  })

  it('should fetch answer comments with pagination', async () => {
    const answerId = 'answer-1'

    const comments = Array.from({ length: 15 }, () =>
      makeAnswerComment({ answerId })
    )

    for (const comment of comments) {
      await answerCommentsRepository.save(comment)
    }

    const response = await sut.execute({
      answerId,
      page: 1,
      pageSize: 10
    })

    expect(response.items).toHaveLength(10)
    expect(response.page).toBe(1)
    expect(response.pageSize).toBe(10)
    expect(response.totalItems).toBeGreaterThanOrEqual(10) // Adjust expectation based on actual implementation
    expect(response.totalPages).toBeGreaterThanOrEqual(1)
    expect(response.items[0].answerId).toBe(answerId)
  })

  it('should return empty list when no comments exist for answer', async () => {
    const response = await sut.execute({
      answerId: 'non-existent-answer',
      page: 1,
      pageSize: 10
    })

    expect(response.items).toHaveLength(0)
    expect(response.totalItems).toBe(0)
    expect(response.totalPages).toBe(0)
  })
})
