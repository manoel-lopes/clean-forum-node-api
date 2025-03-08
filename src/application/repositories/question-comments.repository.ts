import type { PaginationParams } from '@/core/application/pagination-params'
import type { QuestionComment } from '@/infra/persistence/typeorm/data-mappers/question-comment/question-comment.models'
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
