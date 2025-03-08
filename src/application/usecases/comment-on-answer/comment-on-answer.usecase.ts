import type { AnswersRepository } from '@/application/repositories/answers.repository'
import type {
  AnswerCommentsRepository
} from '@/application/repositories/answer-comments.repository'
import { Comment } from '@/infra/persistence/typeorm/data-mappers/comment/comment.mapper'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import type { CommentOnAnswerRequest } from './ports/comment-on-answer.request'

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

    const comment = Comment.create({ content, authorId })
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
