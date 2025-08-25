import type { PaginatedItems } from '@/core/application/paginated-items'
import type { PaginationParams } from '@/core/application/pagination-params'
import type { QuestionComment } from '@/domain/entities/question-comment/question-comment.entity'
import type {
  BaseCommentsRepository,
  UpdateCommentData
} from './base/base-comments.repository'

export type PaginatedQuestionComments = Required<PaginatedItems<QuestionComment>>

export type QuestionCommentsRepository = BaseCommentsRepository & {
  save: (comment: QuestionComment) => Promise<void>
  update (commentData: UpdateCommentData): Promise<QuestionComment>
  findById(commentId: string): Promise<QuestionComment | null>
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams): Promise<PaginatedQuestionComments>
}
