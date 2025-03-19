import type {
  QuestionCommentsRepository
} from '@/application/repositories/question-comments.repository'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { NotAuthorError } from '@/application/errors/not-author.error'

export type DeleteQuestionCommentRequest = {
  authorId: string
  commentId: string
}

export class DeleteQuestionCommentUseCase {
  constructor (private questionCommentsRepository: QuestionCommentsRepository) {
    Object.freeze(this)
  }

  async execute ({ authorId, commentId }: DeleteQuestionCommentRequest): Promise<void> {
    const comment = await this.questionCommentsRepository.findById(commentId)
    if (!comment) {
      throw new ResourceNotFoundError('Question comment')
    }

    if (comment.authorId !== authorId) {
      throw new NotAuthorError('question comment')
    }
    await this.questionCommentsRepository.delete(comment.id)
  }
}
