import type { PaginatedItems } from '@/core/application/paginated-items'
import type { PaginationParams } from '@/core/application/pagination-params'
import type { QuestionComment } from '@/domain/models/question-comment/question-comment.model'
import type {
  CommentsRepository
} from './comments.repository'

export type PaginatedQuestionComments = Required<PaginatedItems<QuestionComment>>

export type QuestionCommentsRepository = CommentsRepository<QuestionComment> & {
  save: (comment: QuestionComment) => Promise<void>
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams): Promise<PaginatedQuestionComments>
}
