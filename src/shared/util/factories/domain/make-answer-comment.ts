import { uuidv7 } from 'uuidv7'
import type { AnswerComment } from '@/domain/enterprise/entities/answer-comment.entity'
import { faker } from '@faker-js/faker'

export function makeAnswerComment (override: Partial<AnswerComment> = {}): AnswerComment {
  const comment: AnswerComment = {
    id: uuidv7(),
    content: faker.lorem.sentence(),
    authorId: faker.string.uuid(),
    answerId: faker.string.uuid(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  return Object.assign(comment, override)
}
