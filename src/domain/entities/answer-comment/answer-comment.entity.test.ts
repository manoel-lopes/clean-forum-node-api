import { describe, expect, it } from 'vitest'
import { AnswerComment } from './answer-comment.entity'

describe('AnswerComment', () => {
  describe('create', () => {
    it('should be able to recreate an answer comment from existing data with id', () => {
      const existingId = 'existing-comment-id'

      const answerComment = AnswerComment.create({
        content: 'This is a comment on an answer',
        authorId: 'author-id',
        answerId: 'answer-id'
      }, existingId)

      expect(answerComment.id).toBe(existingId)
      expect(answerComment.content).toBe('This is a comment on an answer')
      expect(answerComment.authorId).toBe('author-id')
      expect(answerComment.answerId).toBe('answer-id')
    })
  })
})
