import type {
  AnswerCommentsRepository
} from '@/domain/application/repositories/answer-comments.repository'
import type { AnswersRepository } from '@/domain/application/repositories/answers.repository'
import {
  InMemoryAnswerCommentsRepository
} from '@/infra/persistence/repositories/in-memory/in-memory-answer-comments.repository'
import {
  InMemoryAnswersRepository
} from '@/infra/persistence/repositories/in-memory/in-memory-answers.repository'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
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
    await expect(sut.execute({
      answerId: 'nonexistent_answer',
      content: 'any_comment',
      authorId: 'any_author_id',
    })).rejects.toThrowError(new ResourceNotFoundError('Answer'))
  })

  it('should comment on a answer', async () => {
    const answer = makeAnswer()
    await answersRepository.create(answer)

    await sut.execute({
      answerId: answer.id,
      content: 'any_comment',
      authorId: 'any_author_id',
    })

    const comments = await answerCommentsRepository.findManyByAnswerId(answer.id, {
      page: 1,
      pageSize: 10,
    })
    expect(comments.items).toHaveLength(1)
    expect(comments.items[0].id).toBeDefined()
    expect(comments.items[0].content).toBe('any_comment')
    expect(comments.items[0].authorId).toBe('any_author_id')
    expect(comments.items[0].createdAt).toBeInstanceOf(Date)
    expect(comments.items[0].updatedAt).toBeInstanceOf(Date)
  })
})
