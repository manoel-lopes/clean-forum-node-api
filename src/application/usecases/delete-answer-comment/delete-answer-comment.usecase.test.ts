import type { AnswerCommentsRepository } from '@/application/repositories/answer-comments.repository'
import {
  InMemoryAnswerCommentsRepository
} from '@/infra/persistence/repositories/in-memory/in-memory-answer-comments.repository'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { NotAuthorError } from '@/application/errors/not-author.error'
import { makeAnswer } from '@/util/factories/domain/make-answer'
import { makeAnswerComment } from '@/util/factories/domain/make-answer-comment'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment.usecase'

describe('Delete Answer Comment', () => {
  let answerCommentsRepository: AnswerCommentsRepository
  let sut: DeleteAnswerCommentUseCase

  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    sut = new DeleteAnswerCommentUseCase(answerCommentsRepository)
  })

  it('should not be able to delete a inexistent answer comment', async () => {
    await expect(sut.execute({
      commentId: 'nonexistent_comment',
      authorId: 'any_author_id'
    })).rejects.toThrow(new ResourceNotFoundError('Answer comment'))
  })

  it('should not delete an answer comment if the user is not the author', async () => {
    const answer = makeAnswer()
    const comment = makeAnswerComment(answer.id)
    await answerCommentsRepository.save(comment)

    await expect(sut.execute({
      commentId: comment.id,
      authorId: 'wrong_author_id'
    })).rejects.toThrow(new NotAuthorError('answer comment'))
  })

  it('should delete a answer comment', async () => {
    const answer = makeAnswer()
    const comment = makeAnswerComment(answer.id)
    await answerCommentsRepository.save(comment)

    const currentComment = await answerCommentsRepository.findById(comment.id)
    expect(currentComment?.id).toBe(comment.id)
    expect(currentComment?.content).toBe(comment.content)
    expect(currentComment?.authorId).toBe(comment.authorId)
    expect(currentComment?.answerId).toBe(comment.answerId)
    expect(currentComment?.createdAt).toBeInstanceOf(Date)
    expect(currentComment?.updatedAt).toBeInstanceOf(Date)

    await sut.execute({ commentId: comment.id, authorId: comment.authorId })

    const deletedAnswer = await answerCommentsRepository.findById(comment.id)
    expect(deletedAnswer).toBeNull()
  })
})
