import { InMemoryQuestionCommentsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-question-comments.repository'
import { InMemoryQuestionsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-questions.repository'
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
    const input = {
      commentId: 'nonexistent-comment-id',
      authorId: 'any-author-id',
    }

    await expect(sut.execute(input)).rejects.toThrow('Comment not found')
  })

  it('should not delete a comment if the user is not the comment author or question author', async () => {
    const question = makeQuestion({ authorId: 'question-author-id' })
    await questionsRepository.create(question)

    const comment = makeQuestionComment({
      questionId: question.id,
      authorId: 'comment-author-id',
    })
    await questionCommentsRepository.create(comment)

    const input = {
      commentId: comment.id,
      authorId: 'unauthorized-user-id',
    }

    await expect(sut.execute(input)).rejects.toThrow('The user is not the author of the comment')
  })

  it('should delete a comment when user is the comment author', async () => {
    const question = makeQuestion({ authorId: 'question-author-id' })
    await questionsRepository.create(question)

    const comment = makeQuestionComment({
      questionId: question.id,
      authorId: 'comment-author-id',
    })
    await questionCommentsRepository.create(comment)

    const input = {
      commentId: comment.id,
      authorId: comment.authorId,
    }

    await sut.execute(input)

    const deletedComment = await questionCommentsRepository.findById(comment.id)
    expect(deletedComment).toBeNull()
  })

  it('should delete a comment when user is the question author', async () => {
    const question = makeQuestion({ authorId: 'question-author-id' })
    await questionsRepository.create(question)

    const comment = makeQuestionComment({
      questionId: question.id,
      authorId: 'comment-author-id',
    })
    await questionCommentsRepository.create(comment)

    const input = {
      commentId: comment.id,
      authorId: question.authorId,
    }

    await sut.execute(input)

    const deletedComment = await questionCommentsRepository.findById(comment.id)
    expect(deletedComment).toBeNull()
  })
})
