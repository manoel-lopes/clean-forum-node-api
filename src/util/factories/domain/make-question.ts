import { faker } from '@faker-js/faker'
import { Question, QuestionProps } from '@domain/entities/question/question.entity'

export function makeQuestion(override: Partial<QuestionProps> = {}, id?: string): Question {
  const question = Question.create({
    title: faker.lorem.sentence(),
    content: faker.lorem.text(),
    authorId: faker.string.uuid(),
    ...override,
  }, id)

  return question
}
