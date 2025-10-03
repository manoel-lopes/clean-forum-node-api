import { Answer } from '@/domain/models/answer/answer.model'
import { faker } from '@faker-js/faker'

export function makeAnswer (override: Partial<Answer> = {}): Answer {
  return new Answer(
    override.content ?? faker.lorem.paragraphs(),
    override.questionId ?? faker.string.uuid(),
    override.authorId ?? faker.string.uuid(),
    override.id
  )
}
