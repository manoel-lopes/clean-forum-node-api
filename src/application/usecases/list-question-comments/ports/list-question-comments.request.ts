import type { PaginationParams } from '@/core/application/pagination-params'

export type ListQuestionCommentsRequest = PaginationParams & {
  questionId: string
}
