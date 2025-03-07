import type { UseCase } from '@/core/application/use-case'
import type { QuestionsRepository } from '@/application/repositories/questions.repository'
import type { Question } from '@/domain/entities/question/question.entity'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import type { EditQuestionRequest } from './ports/edit-question.request'

export class EditQuestionUseCase implements UseCase {
  constructor (private readonly questionsRepository: QuestionsRepository) {
    Object.freeze(this)
  }

  async execute (req: EditQuestionRequest): Promise<Question> {
    const { questionId, title, content, bestAnswerId } = req
    const question = await this.questionsRepository.findById(questionId)
    if (!question) {
      throw new ResourceNotFoundError('Question')
    }

    const editedQuestion = await this.questionsRepository.update({
      id: questionId,
      title,
      content,
      bestAnswerId,
    })
    return editedQuestion
  }
}
