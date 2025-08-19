import type { PaginationParams } from '@/core/application/pagination-params'
import type { Answer } from '@/domain/entities/answer/answer.entity'

export type FindManyByQuestionIdParams = PaginationParams & {
  questionId: string
}
export type AnswersRepository = {
  save: (answer: Answer) => Promise<void>
  findById(answerId: string): Promise<Answer | null>
  delete: (answerId: string) => Promise<void>
}
