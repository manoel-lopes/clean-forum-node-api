import type { PaginationParams } from '@/core/application/pagination-params'
import type { QuestionComment } from '@/domain/entities/question-comment/question-comment.entity'
import type { BaseCommentsRepository, UpdateCommentData } from './base/base-comments.repository'
import type { PaginatedItems } from '@/core/application/paginated-items'

export type UpdateQuestionCommentData = UpdateCommentData
export type PaginatedQuestionComments = PaginatedItems<QuestionComment>

export type QuestionCommentsRepository = BaseCommentsRepository & {
  save: (comment: QuestionComment) => Promise<void>
  update (commentData: UpdateQuestionCommentData): Promise<QuestionComment>
  findById(commentId: string): Promise<QuestionComment | null>
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams): Promise<PaginatedQuestionComments>
}
