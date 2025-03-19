import type { UseCase } from '@/core/application/use-case'
import type {
  QuestionCommentsRepository,
  UpdateQuestionCommentData
} from '@/application/repositories/question-comments.repository'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import type { QuestionComment } from '@/domain/entities/question-comment/question-comment.entity'
import type { Rename } from '@/util/types/rename'

export type EditQuestionCommentRequest = Rename<UpdateQuestionCommentData, 'id', 'commentId'>

export class EditQuestionCommentUseCase implements UseCase {
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
