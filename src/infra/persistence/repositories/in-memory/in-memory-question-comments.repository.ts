import { uuidv7 } from 'uuidv7'
import type { PaginationParams } from '@/core/domain/application/pagination-params'
import type { PaginatedQuestionComments, QuestionCommentsRepository } from '@/domain/application/repositories/question-comments.repository'
import type { QuestionComment, QuestionCommentProps } from '@/domain/enterprise/entities/question-comment.entity'
import { InMemoryCommentsRepository } from './in-memory-comments.repository'

export class InMemoryQuestionCommentsRepository
  extends InMemoryCommentsRepository<QuestionComment>
  implements QuestionCommentsRepository {
  async save (data: QuestionCommentProps): Promise<void> {
    const comment: QuestionComment = {
      id: uuidv7(),
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: data.authorId,
      content: data.content,
      questionId: data.questionId
    }
    this.items.push(comment)
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
