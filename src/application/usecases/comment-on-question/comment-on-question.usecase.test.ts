import type {
  QuestionCommentsRepository
} from '@/application/repositories/question-comments.repository'
import type { QuestionsRepository } from '@/application/repositories/questions.repository'
import { InMemoryQuestionCommentsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-question-comments.repository'
import {
  InMemoryQuestionsRepository
} from '@/infra/persistence/repositories/in-memory/in-memory-questions.repository'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { makeQuestion } from '@/shared/util/factories/domain/make-question'
import { CommentOnQuestionUseCase } from './comment-on-question.usecase'

describe('CommentOnQuestionUseCase', () => {
  let sut: CommentOnQuestionUseCase
  let questionsRepository: QuestionsRepository
  let questionCommentsRepository: QuestionCommentsRepository

  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository()
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new CommentOnQuestionUseCase(questionsRepository, questionCommentsRepository)
  })

  it('should not comment on a inexistent question', async () => {
    await expect(sut.execute({
      questionId: 'nonexistent_question',
      content: 'any_comment',
      authorId: 'any_author_id',
    })).rejects.toThrowError(new ResourceNotFoundError('Question'))
  })

  it('should comment on a question', async () => {
    const question = makeQuestion()
    await questionsRepository.save(question)

    await sut.execute({
      questionId: question.id,
      content: 'any_comment',
      authorId: 'any_author_id',
    })

    const comments = await questionCommentsRepository.findManyByQuestionId(question.id, {
      page: 1,
      pageSize: 10,
    })
    expect(comments.items).toHaveLength(1)
    expect(comments.items[0].id).toBeDefined()
    expect(comments.items[0].content).toBe('any_comment')
    expect(comments.items[0].authorId).toBe('any_author_id')
    expect(comments.items[0].authorId).toBe('any_author_id')
    expect(comments.items[0].createdAt).toBeInstanceOf(Date)
    expect(comments.items[0].updatedAt).toBeInstanceOf(Date)
  })
})
