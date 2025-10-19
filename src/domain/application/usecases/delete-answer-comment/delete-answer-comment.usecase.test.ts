import { InMemoryAnswerCommentsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-answer-comments.repository'
import { InMemoryAnswersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-answers.repository'
import { makeAnswer } from '@/shared/util/factories/domain/make-answer'
import { makeAnswerComment } from '@/shared/util/factories/domain/make-answer-comment'
import { expectToThrowNotAuthor, expectToThrowResourceNotFound } from '@/shared/util/test/test-helpers'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment.usecase'

describe('DeleteAnswerCommentUseCase', () => {
  let sut: DeleteAnswerCommentUseCase
  let answerCommentsRepository: InMemoryAnswerCommentsRepository
  let answersRepository: InMemoryAnswersRepository

  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository()
    answersRepository = new InMemoryAnswersRepository()
    sut = new DeleteAnswerCommentUseCase(answerCommentsRepository, answersRepository)
  })

  it('should not delete a nonexistent comment', async () => {
    await expectToThrowResourceNotFound(
      () =>
        sut.execute({
          commentId: 'any_inexistent_id',
          authorId: 'any_author_id',
        }),
      'Comment'
    )
  })

  it('should not delete a comment if the user is not the comment author or answer author', async () => {
    const answer = makeAnswer({ authorId: 'answer-author-id' })
    await answersRepository.create(answer)
    const comment = makeAnswerComment({
      answerId: answer.id,
      authorId: 'comment-author-id',
    })
    await answerCommentsRepository.create(comment)

    await expectToThrowNotAuthor(
      () =>
        sut.execute({
          commentId: comment.id,
          authorId: 'wrong_author_id',
        }),
      'comment'
    )
  })

  it('should delete a comment when user is the comment author', async () => {
    const answer = makeAnswer({ authorId: 'answer-author-id' })
    await answersRepository.create(answer)
    const comment = makeAnswerComment({
      answerId: answer.id,
      authorId: 'comment-author-id',
    })
    await answerCommentsRepository.create(comment)

    await sut.execute({
      commentId: comment.id,
      authorId: comment.authorId,
    })

    const deletedComment = await answerCommentsRepository.findById(comment.id)
    expect(deletedComment).toBeNull()
  })

  it('should delete a comment when user is the answer author', async () => {
    const answer = makeAnswer({ authorId: 'answer-author-id' })
    await answersRepository.create(answer)
    const comment = makeAnswerComment({
      answerId: answer.id,
      authorId: 'comment-author-id',
    })
    await answerCommentsRepository.create(comment)

    await sut.execute({
      commentId: comment.id,
      authorId: answer.authorId,
    })

    const deletedComment = await answerCommentsRepository.findById(comment.id)
    expect(deletedComment).toBeNull()
  })
})
