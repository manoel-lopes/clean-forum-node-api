import type { UseCase } from '@/core/application/use-case'
import type { CommentsRepository } from '@/application/repositories/comments.repository'
import type { QuestionsRepository } from '@/application/repositories/questions.repository'
import type { AnswersRepository } from '@/application/repositories/answers.repository'
import { NotAuthorError } from '@/application/errors/not-author.error'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { QuestionComment } from '@/domain/entities/question-comment/question-comment.entity'
import { AnswerComment } from '@/domain/entities/answer-comment/answer-comment.entity'

export type DeleteCommentRequest = {
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

    if (comment instanceof QuestionComment) {
      const question = await this.questionsRepository.findById(comment.questionId)
      return question?.authorId === userId
    }

    if (comment instanceof AnswerComment) {
      const answer = await this.answersRepository.findById(comment.answerId)
      return answer?.authorId === userId
    }

    return false
  }
}
