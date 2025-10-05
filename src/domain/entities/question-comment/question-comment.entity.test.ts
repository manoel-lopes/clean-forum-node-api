import { describe, expect, it } from 'vitest'
import { QuestionComment } from './question-comment.entity'

describe('QuestionComment', () => {
  describe('create', () => {
    it('should be able to recreate a question comment from existing data with id', () => {
      const existingId = 'existing-comment-id'

      const questionComment = QuestionComment.create({
        content: 'This is a comment on a question',
        authorId: 'author-id',
        questionId: 'question-id'
      }, existingId)

      expect(questionComment.id).toBe(existingId)
      expect(questionComment.content).toBe('This is a comment on a question')
      expect(questionComment.authorId).toBe('author-id')
      expect(questionComment.questionId).toBe('question-id')
    })
  })
})
