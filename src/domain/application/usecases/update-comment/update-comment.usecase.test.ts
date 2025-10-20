import { InMemoryCommentsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-comments.repository'
import { makeComment } from '@/shared/util/factories/domain/make-comment'
import { UpdateCommentUseCase } from './update-comment.usecase'

describe('UpdateCommentUseCase', () => {
  let sut: UpdateCommentUseCase
  let commentsRepository: InMemoryCommentsRepository

  beforeEach(() => {
    commentsRepository = new InMemoryCommentsRepository()
    sut = new UpdateCommentUseCase(commentsRepository)
  })

  it('should not update a nonexistent comment', async () => {
    const input = {
      commentId: 'nonexistent-comment-id',
      authorId: 'author-id',
      content: 'Updated content',
    }

    await expect(sut.execute(input)).rejects.toThrow('Comment not found')
  })

  it('should not update a comment if the user is not the author', async () => {
    const comment = makeComment({ authorId: 'comment-author-id' })
    await commentsRepository.create(comment)

    const input = {
      commentId: comment.id,
      authorId: 'unauthorized-user-id',
      content: 'Updated content',
    }

    await expect(sut.execute(input)).rejects.toThrow('The user is not the author of the comment')
  })

  it('should update a comment', async () => {
    const comment = makeComment({
      authorId: 'comment-author-id',
      content: 'Original content',
    })
    await commentsRepository.create(comment)

    const input = {
      commentId: comment.id,
      authorId: comment.authorId,
      content: 'Updated content',
    }

    const result = await sut.execute(input)

    expect(result.id).toBe(comment.id)
    expect(result.content).toBe('Updated content')
  })
})
