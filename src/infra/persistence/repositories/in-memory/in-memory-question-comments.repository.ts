import type { PaginationParams } from '@/core/application/pagination-params'
import type { UpdateCommentData } from '@/application/repositories/base/base-comments.repository'
import type { PaginatedQuestionComments, QuestionCommentsRepository } from '@/application/repositories/question-comments.repository'
import type { QuestionComment } from '@/domain/entities/question-comment/question-comment.entity'
import { BaseInMemoryRepository as BaseRepository } from './base/base-in-memory.repository'

export class InMemoryQuestionCommentsRepository
  extends BaseRepository<QuestionComment>
  implements QuestionCommentsRepository {
  async update (commentData: UpdateCommentData): Promise<QuestionComment> {
    const { where, data } = commentData
    const updatedComment = await this.updateOne({ where, data })
    return updatedComment
  }

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
