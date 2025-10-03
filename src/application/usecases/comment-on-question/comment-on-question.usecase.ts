import type { QuestionCommentsRepository } from '@/application/repositories/question-comments.repository'
import type { QuestionsRepository } from '@/application/repositories/questions.repository'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { QuestionComment } from '@/domain/models/question-comment/question-comment.model'
import type { Optional } from '@/util/types/optional'

export type CommentOnQuestionRequest = Optional<Omit<QuestionComment, 'id'>, 'createdAt' | 'updatedAt'>

export class CommentOnQuestionUseCase {
  constructor (
    private questionsRepository: QuestionsRepository,
    private questionCommentsRepository: QuestionCommentsRepository
  ) {
    Object.freeze(this)
  }

  async execute (request: CommentOnQuestionRequest): Promise<QuestionComment> {
    const { questionId, content, authorId } = request
    const question = await this.questionsRepository.findById(questionId)
    if (!question) {
      throw new ResourceNotFoundError('Question')
    }
    const comment = new QuestionComment(authorId, content, questionId)
    await this.questionCommentsRepository.save(comment)
    return comment
  }
}
