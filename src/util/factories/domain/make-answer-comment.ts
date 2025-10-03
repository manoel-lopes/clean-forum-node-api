import { AnswerComment } from '@/domain/models/answer-comment/answer-comment.model'
import { faker } from '@faker-js/faker'

export function makeAnswerComment (override: Partial<AnswerComment> = {}): AnswerComment {
  return new AnswerComment(
    override.authorId ?? faker.string.uuid(),
    override.content ?? faker.lorem.sentence(),
    override.answerId ?? faker.string.uuid(),
    override.id
  )
}
