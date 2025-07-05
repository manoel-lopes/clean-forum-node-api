import { faker } from '@faker-js/faker'

import { Answer } from '@/domain/entities/answer/answer.entity'

export function makeAnswer (override: Partial<Answer> = {}): Answer {
  const answer = Answer.create({
    content: faker.lorem.paragraphs(),
    authorId: faker.string.uuid(),
    questionId: faker.string.uuid()
  })
  return Object.assign(answer, override)
}
