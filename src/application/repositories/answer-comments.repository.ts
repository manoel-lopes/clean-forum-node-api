import type { PaginatedItems } from '@/core/application/paginated-items'
import type { PaginationParams } from '@/core/application/pagination-params'
import type { AnswerComment } from '@/domain/entities/answer-comment/answer-comment.entity'
import type {
  CommentsRepository
} from './base/comments.repository'

export type PaginatedAnswerComments = Required<PaginatedItems<AnswerComment>>

export type AnswerCommentsRepository = CommentsRepository<AnswerComment> & {
  save: (comment: AnswerComment) => Promise<void>
  findManyByAnswerId(
    answerId: string,
    params: PaginationParams): Promise<PaginatedAnswerComments>
}
