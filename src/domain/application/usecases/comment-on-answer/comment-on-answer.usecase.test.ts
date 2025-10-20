import type { AnswerCommentsRepository } from '@/domain/application/repositories/answer-comments.repository'
import type { AnswersRepository } from '@/domain/application/repositories/answers.repository'
import { InMemoryAnswerCommentsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-answer-comments.repository'
import { InMemoryAnswersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-answers.repository'
import { makeAnswer } from '@/shared/util/factories/domain/make-answer'
import { CommentOnAnswerUseCase } from './comment-on-answer.usecase'

describe('CommentOnAnswerUseCase', () => {
  let sut: CommentOnAnswerUseCase
  let answersRepository: AnswersRepository
  let answerCommentsRepository: AnswerCommentsRepository

  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository()
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new CommentOnAnswerUseCase(answersRepository, answerCommentsRepository)
  })

  it('should not comment on a inexistent answer', async () => {
    const input = {
      answerId: 'nonexistent-answer-id',
      content: 'Test comment content',
      authorId: 'author-id',
    }

    await expect(sut.execute(input)).rejects.toThrow('Answer not found')
  })

  it('should comment on a answer', async () => {
    const answer = makeAnswer()
    await answersRepository.create(answer)

    const input = {
      answerId: answer.id,
      content: 'Test comment content',
      authorId: 'author-id',
    }

    await sut.execute(input)

    const comments = await answerCommentsRepository.findManyByAnswerId(answer.id, {
      page: 1,
      pageSize: 10,
    })

    expect(comments.items).toHaveLength(1)
    expect(comments.items[0].content).toBe('Test comment content')
    expect(comments.items[0].authorId).toBe('author-id')
    expect(comments.items[0].answerId).toBe(answer.id)
  })
})
