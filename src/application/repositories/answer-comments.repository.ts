import type { PaginationParams } from '@/core/application/pagination-params'
import type { AnswerComment } from '@/infra/persistence/typeorm/data-mappers/answer-comment/answer-comment.mapper'
import type { BaseCommentsRepository, UpdateCommentData } from './base/base-comments.repository'
import type { PaginatedItems } from '@/core/application/paginated-items'

export type UpdateAnswerCommentData = UpdateCommentData
export type PaginatedAnswerComments = PaginatedItems<AnswerComment>

export type AnswerCommentsRepository = BaseCommentsRepository & {
  save: (comment: AnswerComment) => Promise<void>
  update (commentData: UpdateAnswerCommentData): Promise<AnswerComment>
  findById(commentId: string): Promise<AnswerComment | null>
  findManyByAnswerId(
    answerId: string,
    params: PaginationParams): Promise<PaginatedAnswerComments>
}
