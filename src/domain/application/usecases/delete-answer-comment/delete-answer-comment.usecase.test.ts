import { makeAnswerData } from 'tests/factories/domain/make-answer'
import { makeAnswerCommentData } from 'tests/factories/domain/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-answer-comments.repository'
import { InMemoryAnswersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-answers.repository'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment.usecase'

describe('DeleteAnswerCommentUseCase', () => {
  let sut: DeleteAnswerCommentUseCase
  let answerCommentsRepo: InMemoryAnswerCommentsRepository
  let answersRepo: InMemoryAnswersRepository

  beforeEach(() => {
    answerCommentsRepo = new InMemoryAnswerCommentsRepository()
    answersRepo = new InMemoryAnswersRepository()
    sut = new DeleteAnswerCommentUseCase(answerCommentsRepo, answersRepo)
  })

  it('should not delete a nonexistent comment', async () => {
    await expect(
      sut.execute({
        commentId: 'any_inexistent_id',
        authorId: 'any_author_id',
      })
    ).rejects.toThrow('Comment not found')
  })

  it('should not delete a comment if the answer does not exist', async () => {
    const answer = await answersRepo.create(makeAnswerData({ authorId: 'answer-author-id' }))
    const comment = await answerCommentsRepo.create(makeAnswerCommentData({
      answerId: answer.id,
      authorId: 'comment-author-id',
    }))
    await answersRepo.delete(answer.id)

    await expect(
      sut.execute({
        commentId: comment.id,
        authorId: 'comment-author-id',
      })
    ).rejects.toThrow('Answer not found')
  })

  it('should not delete a comment if the user is not the comment author or answer author', async () => {
    const answer = await answersRepo.create(makeAnswerData({ authorId: 'answer-author-id' }))

    const comment = await answerCommentsRepo.create(makeAnswerCommentData({
      answerId: answer.id,
      authorId: 'comment-author-id',
    }))

    await expect(
      sut.execute({
        commentId: comment.id,
        authorId: 'wrong_author_id',
      })
    ).rejects.toThrow('The user is not the author of the comment')
  })

  it('should delete a comment when user is the comment author', async () => {
    const answer = await answersRepo.create(makeAnswerData({ authorId: 'answer-author-id' }))
    const comment = await answerCommentsRepo.create(makeAnswerCommentData({
      answerId: answer.id,
      authorId: 'comment-author-id',
    }))

    await sut.execute({
      commentId: comment.id,
      authorId: comment.authorId,
    })

    const deletedComment = await answerCommentsRepo.findById(comment.id)
    expect(deletedComment).toBeNull()
  })

  it('should delete a comment when user is the answer author', async () => {
    const answer = await answersRepo.create(makeAnswerData({ authorId: 'answer-author-id' }))
    const comment = await answerCommentsRepo.create(makeAnswerCommentData({
      answerId: answer.id,
      authorId: 'comment-author-id',
    }))

    await sut.execute({
      commentId: comment.id,
      authorId: answer.authorId,
    })

    const deletedComment = await answerCommentsRepo.findById(comment.id)
    expect(deletedComment).toBeNull()
  })
})
