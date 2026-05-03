import type { QuestionCommentsRepository } from '@/domain/application/repositories/question-comments.repository'
import type { QuestionsRepository } from '@/domain/application/repositories/questions.repository'
import type { QuestionComment, QuestionCommentProps } from '@/domain/enterprise/entities/question-comment.entity'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'

type CommentOnQuestionRequest = QuestionCommentProps

export class CommentOnQuestionUseCase {
  constructor (
    private questionsRepo: QuestionsRepository,
    private questionCommentsRepo: QuestionCommentsRepository
  ) {
    Object.freeze(this)
  }

  async execute (request: CommentOnQuestionRequest): Promise<QuestionComment> {
    const { questionId, content, authorId } = request
    const question = await this.questionsRepo.findById(questionId)
    if (!question) {
      throw new ResourceNotFoundError('Question')
    }
    const comment = await this.questionCommentsRepo.create({ content, authorId, questionId })
    return comment
  }
}
