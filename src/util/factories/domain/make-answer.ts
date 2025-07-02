import { faker } from '@faker-js/faker'
import { Answer, AnswerProps } from '@domain/entities/answer/answer.entity'

export function makeAnswer(override: Partial<AnswerProps> = {}, id?: string): Answer {
  const answer = Answer.create({
    content: faker.lorem.text(),
    authorId: faker.string.uuid(),
    questionId: faker.string.uuid(),
    ...override,
  }, id)

  return answer
}
