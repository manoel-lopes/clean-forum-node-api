import { uuidv7 } from 'uuidv7'
import type { QuestionComment } from '@/domain/enterprise/entities/question-comment.entity'
import { faker } from '@faker-js/faker'

export function makeQuestionComment (override: Partial<QuestionComment> = {}): QuestionComment {
  const comment: QuestionComment = {
    id: uuidv7(),
    content: faker.lorem.sentence(),
    authorId: faker.string.uuid(),
    questionId: faker.string.uuid(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  return Object.assign(comment, override)
}
