import type { UseCase } from '@/core/application/use-case'
import type {
  AnswerCommentsRepository,
  UpdateAnswerCommentData
} from '@/application/repositories/answer-comments.repository'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import type { AnswerComment } from '@/domain/entities/answer-comment/answer-comment.entity'
import type { Rename } from '@/util/types/rename'

export type EditAnswerCommentRequest = Rename<UpdateAnswerCommentData, 'id', 'commentId'>

export class EditAnswerCommentUseCase implements UseCase {
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
