import type { AnswerCommentsRepository } from '@/application/repositories/answer-comments.repository'
import type { AnswersRepository } from '@/application/repositories/answers.repository'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { AnswerComment } from '@/domain/entities/answer-comment/answer-comment.entity'
import type { AnswerCommentProps } from '@/domain/entities/answer-comment/ports/answer-comment.props'

export type CommentOnAnswerRequest = AnswerCommentProps

export class CommentOnAnswerUseCase {
  constructor (
    private answersRepository: AnswersRepository,
    private answerCommentsRepository: AnswerCommentsRepository
  ) {
    Object.freeze(this)
  }

  async execute (request: CommentOnAnswerRequest): Promise<AnswerComment> {
    const { answerId, content, authorId } = request
    const answer = await this.answersRepository.findById(answerId)
    if (!answer) {
      throw new ResourceNotFoundError('Answer')
    }
    const comment = AnswerComment.create({ content, authorId, answerId })
    await this.answerCommentsRepository.save(comment)
    return comment
  }
}
