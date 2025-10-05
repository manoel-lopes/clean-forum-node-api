import { describe, expect, it } from 'vitest'
import { Answer } from './answer.entity'

describe('Answer', () => {
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
