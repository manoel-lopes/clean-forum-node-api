import type { AnswerCommentsRepository } from '@/application/repositories/answer-comments.repository'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { NotAuthorError } from '@/application/errors/not-author.error'
import type { DeleteAnswerCommentRequest } from './port/delete-answer-comment.request'

export class DeleteAnswerCommentUseCase {
  constructor (private answerCommentsRepository: AnswerCommentsRepository) {
    Object.freeze(this)
  }

  async execute ({ authorId, commentId }: DeleteAnswerCommentRequest): Promise<void> {
    const comment = await this.answerCommentsRepository.findById(commentId)
    if (!comment) {
      throw new ResourceNotFoundError('Answer comment')
    }

    if (comment.authorId !== authorId) {
      throw new NotAuthorError('answer comment')
    }
    await this.answerCommentsRepository.delete(comment.id)
  }
}
