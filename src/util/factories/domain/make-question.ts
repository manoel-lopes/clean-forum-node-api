import { Question } from '@/infra/persistence/typeorm/data-mappers/question/question.mapper'

export function makeQuestion (override: Partial<Question> = {}): Question {
  const question = Question.create({
    title: 'any_question_title',
    content: 'any_question_content',
    authorId: 'any_author_id',
  })
  return Object.assign(question, override)
}
