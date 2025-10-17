import type { PaginationParams } from '@/core/domain/application/pagination-params'

export type QuestionIncludeOption = 'comments' | 'attachments' | 'author'

export type PaginationWithIncludeParams = PaginationParams & {
  include?: QuestionIncludeOption[]
}
