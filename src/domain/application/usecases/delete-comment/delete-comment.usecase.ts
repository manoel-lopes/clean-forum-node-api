import type { UseCase } from '@/core/domain/application/use-case'
import type { AnswersRepository } from '@/domain/application/repositories/answers.repository'
import type { CommentsRepository } from '@/domain/application/repositories/base/comments.repository'
import type { QuestionsRepository } from '@/domain/application/repositories/questions.repository'
import { NotAuthorError } from '@/shared/application/errors/not-author.error'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'

type DeleteCommentRequest = {
  commentId: string
  authorId: string
}

export class DeleteCommentUseCase implements UseCase {
  constructor (
    private readonly commentRepository: CommentsRepository,
    private readonly questionsRepository: QuestionsRepository,
    private readonly answersRepository: AnswersRepository
  ) {}

  async execute (req: DeleteCommentRequest): Promise<void> {
    const { commentId, authorId } = req
    const comment = await this.commentRepository.findById(commentId)
    if (!comment) {
      throw new ResourceNotFoundError('Comment')
    }
    const canDelete = await this.canUserDeleteComment(comment, authorId)
    if (!canDelete) {
      throw new NotAuthorError('comment')
    }
    await this.commentRepository.delete(commentId)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async canUserDeleteComment (comment: any, userId: string): Promise<boolean> {
    if (comment.authorId === userId) {
      return true
    }
    // Check if it's a QuestionComment by presence of questionId
    if ('questionId' in comment && comment.questionId) {
      const question = await this.questionsRepository.findById(comment.questionId)
      return question?.authorId === userId
    }
    // Check if it's an AnswerComment by presence of answerId
    if ('answerId' in comment && comment.answerId) {
      const answer = await this.answersRepository.findById(comment.answerId)
      return answer?.authorId === userId
    }
    return false
  }
}
