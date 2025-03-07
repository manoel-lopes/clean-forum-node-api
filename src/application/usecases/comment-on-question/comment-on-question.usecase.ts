import type { QuestionsRepository } from '@/application/repositories/questions.repository'
import type {
  QuestionCommentsRepository
} from '@/application/repositories/question-comments.repository'
import { Comment } from '@/domain/entities/comment/comment.entity'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import type { CommentOnQuestionRequest } from './ports/comment-on-question.request'

export class CommentOnQuestionUseCase {
  constructor (
    private questionsRepository: QuestionsRepository,
    private questionCommentsRepository: QuestionCommentsRepository
  ) {
    Object.freeze(this)
  }

  async execute (request: CommentOnQuestionRequest): Promise<void> {
    const { questionId, content, authorId } = request
    const question = await this.questionsRepository.findById(questionId)
    if (!question) {
      throw new ResourceNotFoundError('Question')
    }

    const comment = Comment.create({ content, authorId })
    await this.questionCommentsRepository.save({
      id: comment.id,
      content: comment.content,
      authorId: comment.authorId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      questionId
    })
  }
}
