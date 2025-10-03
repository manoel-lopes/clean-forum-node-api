import type { UseCase } from '@/core/application/use-case'
import type { QuestionsRepository } from '@/application/repositories/questions.repository'
import { NotAuthorError } from '@/shared/application/errors/not-author.error'
import { ResourceNotFoundError } from '@/shared/application/errors/resource-not-found.error'

type DeleteQuestionRequest = {
  questionId: string
  authorId: string
}

export class DeleteQuestionUseCase implements UseCase {
  constructor (private readonly questionsRepository: QuestionsRepository) {}

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
