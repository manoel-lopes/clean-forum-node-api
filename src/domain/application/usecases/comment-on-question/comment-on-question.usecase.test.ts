import type {
  QuestionCommentsRepository
} from '@/domain/application/repositories/question-comments.repository'
import type { QuestionsRepository } from '@/domain/application/repositories/questions.repository'
import { InMemoryQuestionCommentsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-question-comments.repository'
import {
  InMemoryQuestionsRepository
} from '@/infra/persistence/repositories/in-memory/in-memory-questions.repository'
import { makeQuestion } from '@/shared/util/factories/domain/make-question'
import { createAndSave, expectEntityToMatch, expectToThrowResourceNotFound } from '@/shared/util/test/test-helpers'
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
    const input = {
      questionId: 'nonexistent-question-id',
      content: 'Test comment content',
      authorId: 'author-id'
    }

    await expectToThrowResourceNotFound(
      async () => sut.execute(input),
      'Question'
    )
  })

  it('should comment on a question', async () => {
    const question = await createAndSave(
      makeQuestion,
      questionsRepository
    )

    const input = {
      questionId: question.id,
      content: 'Test comment content',
      authorId: 'author-id'
    }

    await sut.execute(input)

    const comments = await questionCommentsRepository.findManyByQuestionId(question.id, {
      page: 1,
      pageSize: 10
    })
    expect(comments.items).toHaveLength(1)
    expectEntityToMatch(comments.items[0], {
      content: 'Test comment content',
      authorId: 'author-id',
      questionId: question.id
    })
  })
})
