import type { PaginationParams } from '@/core/application/pagination-params'

export type ListAnswerCommentsRequest = PaginationParams & {
  answerId: string
}
