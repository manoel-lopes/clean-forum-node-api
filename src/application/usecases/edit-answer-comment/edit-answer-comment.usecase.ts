import type {
  AnswerCommentsRepository
} from '@/application/repositories/answer-comments.repository'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import type { EditAnswerCommentRequest } from './ports/edit-answer-comment.request'
import type { AnswerComment } from '@/infra/persistence/typeorm/data-mappers/answer-comment/answer-comment.mapper'

export class EditAnswerCommentUseCase {
  constructor (private answerCommentsRepository: AnswerCommentsRepository) {
    Object.freeze(this)
  }

  async execute ({ commentId, content }: EditAnswerCommentRequest): Promise<AnswerComment> {
    const comment = await this.answerCommentsRepository.findById(commentId)
    if (!comment) {
      throw new ResourceNotFoundError('Answer comment')
    }

    const updatedComment = await this.answerCommentsRepository.update({
      id: comment.id,
      content,
    })
    return updatedComment
  }
}
