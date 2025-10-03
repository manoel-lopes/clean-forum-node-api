import { QuestionComment } from '@/domain/entities/question-comment/question-comment.entity'
import { faker } from '@faker-js/faker'

export function makeQuestionComment (override: Partial<QuestionComment> = {}): QuestionComment {
  const comment = QuestionComment.create({
    content: faker.lorem.sentence(),
    authorId: faker.string.uuid(),
    questionId: faker.string.uuid()
  })
  return Object.assign(comment, override)
}
