import type { PaginatedItems } from '@/core/application/paginated-items'
import type { PaginationParams } from '@/core/application/pagination-params'
import type { AnswerComment } from '@/domain/entities/answer-comment/answer-comment.entity'
import type {
  BaseCommentsRepository,
  UpdateCommentData
} from './base/base-comments.repository'

export type PaginatedAnswerComments = Required<PaginatedItems<AnswerComment>>

export type AnswerCommentsRepository = BaseCommentsRepository & {
  save: (comment: AnswerComment) => Promise<void>
  update (commentData: UpdateCommentData): Promise<AnswerComment>
  findById(commentId: string): Promise<AnswerComment | null>
  findManyByAnswerId(
    answerId: string,
    params: PaginationParams): Promise<PaginatedAnswerComments>
}
