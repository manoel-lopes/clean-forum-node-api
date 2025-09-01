import type { PaginationParams } from '@/core/application/pagination-params'
import type { PaginatedQuestionComments, QuestionCommentsRepository } from '@/application/repositories/question-comments.repository'
import type { QuestionComment } from '@/domain/entities/question-comment/question-comment.entity'
import { InMemoryCommentsRepository } from './in-memory-comments.repository'

export class InMemoryQuestionCommentsRepository
  extends InMemoryCommentsRepository<QuestionComment>
  implements QuestionCommentsRepository {
  async findManyByQuestionId (questionId: string, params: PaginationParams): Promise<PaginatedQuestionComments> {
    const comments = await this.findManyItemsBy({
      where: { questionId },
      params: {
        page: params.page,
        pageSize: params.pageSize,
        order: params.order
      }
    })
    return comments
  }
}
