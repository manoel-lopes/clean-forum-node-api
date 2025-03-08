import type { PaginationParams } from '@/core/application/pagination-params'
import type { PaginatedItems } from '@/core/application/paginated-items'
import type { Answer } from '@/infra/persistence/typeorm/data-mappers/answer/answer.mapper'

export type UpdateAnswerData = {
  id: string
  content?: string
}

export type PaginatedAnswers = PaginatedItems<Answer>

export type AnswersRepository = {
  save: (answer: Answer) => Promise<void>
  findById(answerId: string): Promise<Answer | null>
  delete(answerId: string): Promise<void>
  update(answerData: UpdateAnswerData): Promise<Answer>
  findManyByQuestionId(questionId: string, params: PaginationParams): Promise<PaginatedAnswers>
}
