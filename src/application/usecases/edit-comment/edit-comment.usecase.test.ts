import { InMemoryCommentsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-comments.repository'
import { NotAuthorError } from '@/application/errors/not-author.error'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { makeComment } from '@/util/factories/domain/make-comment'
import { EditCommentUseCase } from './edit-comment.usecase'

describe('EditCommentUseCase', () => {
  let sut: EditCommentUseCase
  let commentsRepository: InMemoryCommentsRepository

  beforeEach(() => {
    commentsRepository = new InMemoryCommentsRepository()
    sut = new EditCommentUseCase(commentsRepository)
  })

  it('should not edit a nonexistent comment', async () => {
    await expect(sut.execute({
      commentId: 'any_inexistent_id',
      authorId: 'any_author_id',
      content: 'Updated content'
    })).rejects.toThrowError(new ResourceNotFoundError('Comment'))
  })

  it('should not edit a comment if the user is not the author', async () => {
    const comment = makeComment()
    await commentsRepository.save(comment)

    await expect(sut.execute({
      commentId: comment.id,
      authorId: 'wrong_author_id',
      content: 'Updated content'
    })).rejects.toThrowError(new NotAuthorError('comment'))
  })

  it('should edit a comment', async () => {
    const comment = makeComment()
    await commentsRepository.save(comment)
    const currentComment = await commentsRepository.findById(comment.id)

    const updatedContent = 'Updated content for the comment'
    const response = await sut.execute({
      commentId: comment.id,
      authorId: comment.authorId,
      content: updatedContent
    })

    expect(response.content).not.toBe(currentComment?.content)
    expect(response.content).toBe(updatedContent)
  })
})
