import { InMemoryCommentsRepository } from '@/infra/persistence/repositories/in-memory/in-memory-comments.repository'
import { makeComment } from '@/shared/util/factories/domain/make-comment'
import { createAndSave, expectEntityToMatch, expectToThrowNotAuthor, expectToThrowResourceNotFound } from '@/shared/util/test/test-helpers'
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
      content: 'Updated content'
    }

    await expectToThrowResourceNotFound(
      async () => sut.execute(input),
      'Comment'
    )
  })

  it('should not update a comment if the user is not the author', async () => {
    const comment = await createAndSave(
      makeComment,
      commentsRepository,
      { authorId: 'comment-author-id' }
    )

    const input = {
      commentId: comment.id,
      authorId: 'unauthorized-user-id',
      content: 'Updated content'
    }

    await expectToThrowNotAuthor(
      async () => sut.execute(input),
      'comment'
    )
  })

  it('should update a comment', async () => {
    const comment = await createAndSave(
      makeComment,
      commentsRepository,
      { authorId: 'comment-author-id', content: 'Original content' }
    )

    const input = {
      commentId: comment.id,
      authorId: comment.authorId,
      content: 'Updated content'
    }

    const result = await sut.execute(input)

    expectEntityToMatch(result, {
      id: comment.id,
      content: 'Updated content'
    })
  })
})
