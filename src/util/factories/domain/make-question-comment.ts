import { QuestionComment } from '@/domain/models/question-comment/question-comment.model'
import { faker } from '@faker-js/faker'

export function makeQuestionComment (override: Partial<QuestionComment> = {}): QuestionComment {
  return new QuestionComment(
    override.authorId ?? faker.string.uuid(),
    override.content ?? faker.lorem.sentence(),
    override.questionId ?? faker.string.uuid(),
    override.id
  )
}
