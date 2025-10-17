import { InMemoryQuestionCommentsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-question-comments.repository'
import { InMemoryQuestionsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-questions.repository'
import { makeQuestion } from '@/shared/util/factories/domain/make-question'
import { makeQuestionComment } from '@/shared/util/factories/domain/make-question-comment'
import {
  createAndSave,
  expectEntityToBeDeleted,
  expectToThrowNotAuthor,
  expectToThrowResourceNotFound,
} from '@/shared/util/test/test-helpers'
import { DeleteQuestionCommentUseCase } from './delete-question-comment.usecase'

describe('DeleteQuestionCommentUseCase', () => {
  let sut: DeleteQuestionCommentUseCase
  let questionCommentsRepository: InMemoryQuestionCommentsRepository
  let questionsRepository: InMemoryQuestionsRepository

  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    questionsRepository = new InMemoryQuestionsRepository()
    sut = new DeleteQuestionCommentUseCase(questionCommentsRepository, questionsRepository)
  })

  it('should not delete a nonexistent comment', async () => {
    const input = {
      commentId: 'nonexistent-comment-id',
      authorId: 'any-author-id',
    }

    await expectToThrowResourceNotFound(async () => sut.execute(input), 'Comment')
  })

  it('should not delete a comment if the user is not the comment author or question author', async () => {
    const question = await createAndSave(makeQuestion, questionsRepository, { authorId: 'question-author-id' })
    const comment = await createAndSave(makeQuestionComment, questionCommentsRepository, {
      questionId: question.id,
      authorId: 'comment-author-id',
    })

    const input = {
      commentId: comment.id,
      authorId: 'unauthorized-user-id',
    }

    await expectToThrowNotAuthor(async () => sut.execute(input), 'comment')
  })

  it('should delete a comment when user is the comment author', async () => {
    const question = await createAndSave(makeQuestion, questionsRepository, { authorId: 'question-author-id' })
    const comment = await createAndSave(makeQuestionComment, questionCommentsRepository, {
      questionId: question.id,
      authorId: 'comment-author-id',
    })

    const input = {
      commentId: comment.id,
      authorId: comment.authorId,
    }

    await sut.execute(input)

    await expectEntityToBeDeleted(questionCommentsRepository, comment.id)
  })

  it('should delete a comment when user is the question author', async () => {
    const question = await createAndSave(makeQuestion, questionsRepository, { authorId: 'question-author-id' })
    const comment = await createAndSave(makeQuestionComment, questionCommentsRepository, {
      questionId: question.id,
      authorId: 'comment-author-id',
    })

    const input = {
      commentId: comment.id,
      authorId: question.authorId,
    }

    await sut.execute(input)

    await expectEntityToBeDeleted(questionCommentsRepository, comment.id)
  })
})
