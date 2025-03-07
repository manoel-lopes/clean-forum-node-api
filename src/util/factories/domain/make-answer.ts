import { Answer } from '@/domain/entities/answer/answer.entity'

export function makeAnswer (override: Partial<Answer> = {}): Answer {
  const answer = Answer.create({
    content: 'any_question_content',
    authorId: 'any_author_id',
    questionId: 'any_question_id',
  })
  return Object.assign(answer, override)
}
