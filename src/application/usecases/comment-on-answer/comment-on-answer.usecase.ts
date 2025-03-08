import type { AnswersRepository } from '@/application/repositories/answers.repository'
import type {
  AnswerCommentsRepository
} from '@/application/repositories/answer-comments.repository'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import type { CommentOnAnswerRequest } from './ports/comment-on-answer.request'
import {
  AnswerComment
} from '@/infra/persistence/typeorm/data-mappers/answer-comment/answer-comment.mapper'

export class CommentOnAnswerUseCase {
  constructor (
    private answersRepository: AnswersRepository,
    private answerCommentsRepository: AnswerCommentsRepository
  ) {
    Object.freeze(this)
  }

  async execute (request: CommentOnAnswerRequest): Promise<void> {
    const { answerId, content, authorId } = request
    const answer = await this.answersRepository.findById(answerId)
    if (!answer) {
      throw new ResourceNotFoundError('Answer')
    }

    const comment = AnswerComment.create({ content, authorId, answerId })
    await this.answerCommentsRepository.save({
      id: comment.id,
      content: comment.content,
      authorId: comment.authorId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      answerId
    })
  }
}
