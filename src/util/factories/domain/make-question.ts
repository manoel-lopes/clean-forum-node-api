import { faker } from '@faker-js/faker'

import { Question } from '@/domain/entities/question/question.entity'

export function makeQuestion (override: Partial<Question> = {}): Question {
  const question = Question.create({
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs(),
    authorId: faker.string.uuid()
  })
  return Object.assign(question, override)
}
