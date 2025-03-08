import { Question } from '@/domain/entities/question/question.entity'

export function makeQuestion (override: Partial<Question> = {}): Question {
  const question = Question.create({
    title: 'any_question_title',
    content: 'any_question_content',
    authorId: 'any_author_id',
  })
  return Object.assign(question, override)
}
