import { InMemoryCommentsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-comments.repository'
import { UpdateCommentUseCase } from './update-comment.usecase'
import { NotAuthorError } from '@/shared/application/errors/not-author.error'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'
import { makeComment } from '@/shared/util/factories/domain/make-comment'

describe('UpdateCommentUseCase', () => {
  let sut: UpdateCommentUseCase
  let commentsRepository: InMemoryCommentsRepository

  beforeEach(() => {
    commentsRepository = new InMemoryCommentsRepository()
    sut = new UpdateCommentUseCase(commentsRepository)
  })

  it('should not update a nonexistent comment', async () => {
    await expect(sut.execute({
      commentId: 'any_inexistent_id',
      authorId: 'any_author_id',
      content: 'updated content'
    })).rejects.toThrowError(new ResourceNotFoundError('Comment'))
  })

  it('should not update a comment if the user is not the author', async () => {
    const comment = makeComment()
    await commentsRepository.save(comment)

    await expect(sut.execute({
      commentId: comment.id,
      authorId: 'wrong_author_id',
      content: 'updated content'
    })).rejects.toThrowError(new NotAuthorError('comment'))
  })

  it('should update a comment', async () => {
    const comment = makeComment()
    await commentsRepository.save(comment)
    const currentComment = await commentsRepository.findById(comment.id)

    const updatedContent = 'updated content for the comment'
    const response = await sut.execute({
      commentId: comment.id,
      authorId: comment.authorId,
      content: updatedContent
    })

    expect(response.content).not.toBe(currentComment?.content)
    expect(response.content).toBe(updatedContent)
  })
})
