import { AnswerComment } from '@/domain/entities/answer-comment/answer-comment.entity'
import { faker } from '@faker-js/faker'

export function makeAnswerComment (override: Partial<AnswerComment> = {}): AnswerComment {
  const comment = AnswerComment.create({
    content: faker.lorem.sentence(),
    authorId: faker.string.uuid(),
    answerId: faker.string.uuid()
  })
  return Object.assign(comment, override)
}
