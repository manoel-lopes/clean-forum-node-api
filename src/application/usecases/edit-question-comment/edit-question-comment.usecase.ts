import type {
  QuestionCommentsRepository
} from '@/application/repositories/question-comments.repository'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import type { EditQuestionCommentRequest } from './ports/edit-question-comment.request'
import type { QuestionComment } from '@/domain/entities/question-comment/question-comment.entity'

export class EditQuestionCommentUseCase {
  constructor (private questionCommentsRepository: QuestionCommentsRepository) {
    Object.freeze(this)
  }

  async execute ({ commentId, content }: EditQuestionCommentRequest): Promise<QuestionComment> {
    const comment = await this.questionCommentsRepository.findById(commentId)
    if (!comment) {
      throw new ResourceNotFoundError('Question comment')
    }

    const updatedComment = await this.questionCommentsRepository.update({
      id: comment.id,
      content,
    })
    return updatedComment
  }
}
