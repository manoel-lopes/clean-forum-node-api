import type { PaginationParams } from '@/core/application/pagination-params'

export type ListAnswersByQuestionRequest = PaginationParams & {
  questionId: string
}
