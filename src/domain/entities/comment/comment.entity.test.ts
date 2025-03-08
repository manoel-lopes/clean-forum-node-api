import { Comment } from './comment.entity'

describe('Comment', () => {
  it('should create a comment', () => {
    const comment = Comment.create({ authorId: 'any_author_id', content: 'any_content' })
    expect(comment.id).toBeDefined()
    expect(comment.authorId).toBe('any_author_id')
    expect(comment.content).toBe('any_content')
    expect(comment.createdAt).toBeInstanceOf(Date)
    expect(comment.updatedAt).toBeInstanceOf(Date)
  })
})
