import type {
  QuestionCommentsRepository
} from '@/application/repositories/question-comments.repository'
import {
  InMemoryQuestionCommentsRepository
} from '@/infra/persistence/repositories/in-memory/in-memory-question-comments.repository'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { NotAuthorError } from '@/application/errors/not-author.error'
import { makeQuestion } from '@/util/factories/domain/make-question'
import { makeQuestionComment } from '@/util/factories/domain/make-question-comment'
import { DeleteQuestionCommentUseCase } from './delete-question-comment.usecase'

describe('Delete Question Comment', () => {
  let questionCommentsRepository: QuestionCommentsRepository
  let sut: DeleteQuestionCommentUseCase

  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository()
    sut = new DeleteQuestionCommentUseCase(questionCommentsRepository)
  })

  it('should not be able to delete a inexistent question comment', async () => {
    await expect(sut.execute({
      commentId: 'nonexistent_comment',
      authorId: 'any_author_id'
    })).rejects.toThrow(new ResourceNotFoundError('Question comment'))
  })

  it('should not delete an question comment if the user is not the author', async () => {
    const question = makeQuestion()
    const comment = makeQuestionComment(question.id)
    await questionCommentsRepository.save(comment)

    await expect(sut.execute({
      commentId: comment.id,
      authorId: 'wrong_author_id'
    })).rejects.toThrow(new NotAuthorError('question comment'))
  })

  it('should delete a question comment', async () => {
    const question = makeQuestion()
    const comment = makeQuestionComment(question.id)
    await questionCommentsRepository.save(comment)

    const currentComment = await questionCommentsRepository.findById(comment.id)
    expect(currentComment?.id).toBe(comment.id)
    expect(currentComment?.content).toBe(comment.content)
    expect(currentComment?.authorId).toBe(comment.authorId)
    expect(currentComment?.questionId).toBe(comment.questionId)
    expect(currentComment?.createdAt).toBeInstanceOf(Date)
    expect(currentComment?.updatedAt).toBeInstanceOf(Date)

    await sut.execute({ commentId: comment.id, authorId: comment.authorId })

    const deletedQuestion = await questionCommentsRepository.findById(comment.id)
    expect(deletedQuestion).toBeNull()
  })
})
