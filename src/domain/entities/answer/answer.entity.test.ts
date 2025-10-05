import { describe, expect, it } from 'vitest'
import { Answer } from './answer.entity'

describe('Answer', () => {
  describe('create', () => {
    it('should be able to recreate an answer from existing data with id', () => {
      const existingId = 'existing-answer-id'

      const answer = Answer.create({
        content: 'This is an existing answer',
        questionId: 'question-id',
        authorId: 'author-id'
      }, existingId)

      expect(answer.id).toBe(existingId)
      expect(answer.content).toBe('This is an existing answer')
      expect(answer.questionId).toBe('question-id')
      expect(answer.authorId).toBe('author-id')
    })
  })

  describe('excerpt', () => {
    it('should generate excerpt truncated to 45 characters with ellipsis when content is longer', () => {
      const longContent = 'This is a very long answer content that should be truncated to create an excerpt'
      const answer = Answer.create({
        content: longContent,
        questionId: 'question-id',
        authorId: 'author-id'
      })

      expect(answer.excerpt).toBe('This is a very long answer content that shoul...')
    })

    it('should remove trailing space from excerpt before adding ellipsis', () => {
      const content = 'This is an answer with exactly forty five '
      const answer = Answer.create({
        content,
        questionId: 'question-id',
        authorId: 'author-id'
      })

      expect(answer.excerpt).toBe('This is an answer with exactly forty five...')
      expect(answer.excerpt).not.toMatch(/ \.\.\.$/)
    })

    it('should append ellipsis to content shorter than 45 characters', () => {
      const shortContent = 'Short answer'
      const answer = Answer.create({
        content: shortContent,
        questionId: 'question-id',
        authorId: 'author-id'
      })

      expect(answer.excerpt).toBe('Short answer...')
    })
  })
})
