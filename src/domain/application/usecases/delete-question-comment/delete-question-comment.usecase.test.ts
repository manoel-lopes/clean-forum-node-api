import { InMemoryQuestionCommentsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-question-comments.repository'
import { InMemoryQuestionsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-questions.repository'
import { NotAuthorError } from '@/shared/application/errors/not-author.error'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { makeQuestion } from '@/shared/util/factories/domain/make-question'
import { makeQuestionComment } from '@/shared/util/factories/domain/make-question-comment'
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
    await expect(sut.execute({
      commentId: 'any_inexistent_id',
      authorId: 'any_author_id'
    })).rejects.toThrowError(new ResourceNotFoundError('Comment'))
  })

  it('should not delete a comment if the user is not the comment author or question author', async () => {
    const question = makeQuestion({ authorId: 'question-author-id' })
    await questionsRepository.create(question)

    const comment = makeQuestionComment({
      questionId: question.id,
      authorId: 'comment-author-id'
    })
    await questionCommentsRepository.create(comment)

    await expect(sut.execute({
      commentId: comment.id,
      authorId: 'wrong_author_id'
    })).rejects.toThrowError(new NotAuthorError('comment'))
  })

  it('should delete a comment when user is the comment author', async () => {
    const question = makeQuestion({ authorId: 'question-author-id' })
    await questionsRepository.create(question)

    const comment = makeQuestionComment({
      questionId: question.id,
      authorId: 'comment-author-id'
    })
    await questionCommentsRepository.create(comment)

    await sut.execute({
      commentId: comment.id,
      authorId: comment.authorId
    })

    const deletedComment = await questionCommentsRepository.findById(comment.id)
    expect(deletedComment).toBeNull()
  })

  it('should delete a comment when user is the question author', async () => {
    const question = makeQuestion({ authorId: 'question-author-id' })
    await questionsRepository.create(question)

    const comment = makeQuestionComment({
      questionId: question.id,
      authorId: 'comment-author-id'
    })
    await questionCommentsRepository.create(comment)

    await sut.execute({
      commentId: comment.id,
      authorId: question.authorId
    })

    const deletedComment = await questionCommentsRepository.findById(comment.id)
    expect(deletedComment).toBeNull()
  })
})
