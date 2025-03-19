import type { UseCase } from '@/core/application/use-case'
import type { QuestionsRepository } from '@/application/repositories/questions.repository'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'
import { NotAuthorError } from '@/application/errors/not-author.error'

export type DeleteQuestionRequest = {
  questionId: string
  authorId: string
}

export class DeleteQuestionUseCase implements UseCase {
  constructor (private readonly questionsRepository: QuestionsRepository) {
    Object.freeze(this)
  }

  async execute (req: DeleteQuestionRequest): Promise<void> {
    const { questionId, authorId } = req
    const question = await this.questionsRepository.findById(questionId)
    if (!question) {
      throw new ResourceNotFoundError('Question')
    }

    if (question.authorId !== authorId) {
      throw new NotAuthorError('question')
    }

    await this.questionsRepository.delete(questionId)
  }
}
