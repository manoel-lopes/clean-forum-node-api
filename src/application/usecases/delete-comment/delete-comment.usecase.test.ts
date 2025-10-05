import { InMemoryAnswersRepository } from '@/infra/persistence/repositories/in-memory/in-memory-answers.repository'
import { InMemoryCommentsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-comments.repository'
import { InMemoryQuestionsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-questions.repository'
import { NotAuthorError } from '@/shared/application/errors/not-author.error'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { makeComment } from '@/shared/util/factories/domain/make-comment'
import { DeleteCommentUseCase } from './delete-comment.usecase'

describe('DeleteCommentUseCase', () => {
  let sut: DeleteCommentUseCase
  let commentsRepository: InMemoryCommentsRepository
  let questionsRepository: InMemoryQuestionsRepository
  let answersRepository: InMemoryAnswersRepository

  beforeEach(() => {
    commentsRepository = new InMemoryCommentsRepository()
    questionsRepository = new InMemoryQuestionsRepository()
    answersRepository = new InMemoryAnswersRepository()
    sut = new DeleteCommentUseCase(commentsRepository, questionsRepository, answersRepository)
  })

  it('should not delete a nonexistent comment', async () => {
    await expect(sut.execute({
      commentId: 'any_inexistent_id',
      authorId: 'any_author_id'
    })).rejects.toThrowError(new ResourceNotFoundError('Comment'))
  })

  it('should not delete a comment if the user is not the author', async () => {
    const comment = makeComment()
    await commentsRepository.save(comment)

    await expect(sut.execute({
      commentId: comment.id,
      authorId: 'wrong_author_id'
    })).rejects.toThrowError(new NotAuthorError('comment'))
  })

  it('should delete a comment', async () => {
    const comment = makeComment()
    await commentsRepository.save(comment)

    const currentComment = await commentsRepository.findById(comment.id)
    expect(currentComment?.id).toBe(comment.id)
    expect(currentComment?.content).toBe(comment.content)
    expect(currentComment?.authorId).toBe(comment.authorId)
    expect(currentComment?.createdAt).toBeInstanceOf(Date)
    expect(currentComment?.updatedAt).toBeInstanceOf(Date)

    await sut.execute({
      commentId: comment.id,
      authorId: comment.authorId
    })

    const deletedComment = await commentsRepository.findById(comment.id)
    expect(deletedComment).toBeNull()
  })
})
