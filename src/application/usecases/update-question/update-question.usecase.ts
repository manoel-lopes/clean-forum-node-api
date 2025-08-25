import type { UseCase } from '@/core/application/use-case'
import type { QuestionsRepository, UpdateQuestionData } from '@/application/repositories/questions.repository'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import type { Question } from '@/domain/entities/question/question.entity'

export type UpdateQuestionRequest = UpdateQuestionData['data'] & {
  questionId: string
}

export class UpdateQuestionUseCase implements UseCase {
  constructor (
    private readonly questionsRepository: QuestionsRepository
  ) {
    Object.freeze(this)
  }

  async execute (req: UpdateQuestionRequest): Promise<Question> {
    const { questionId, title, content } = req
    const question = await this.questionsRepository.findById(questionId)
    if (!question) {
      throw new ResourceNotFoundError('Question')
    }

    const updatedQuestion = await this.questionsRepository.update({
      where: { id: questionId },
      data: { title, content },
    })

    return updatedQuestion
  }
}
