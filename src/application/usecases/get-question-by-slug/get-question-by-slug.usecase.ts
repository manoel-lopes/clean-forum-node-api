import type { UseCase } from '@/core/application/use-case'
import type { QuestionsRepository } from '@/application/repositories/questions.repository'
import { ResourceNotFoundError } from '@/application/errors/resource-not-found.error'

export type GetQuestionBySlugRequest = {
  slug: string
}

export class GetQuestionBySlugUseCase implements UseCase {
  constructor (private readonly questionsRepository: QuestionsRepository) {
    Object.freeze(this)
  }

  async execute (req: GetQuestionBySlugRequest) {
    const { slug } = req
    const question = await this.questionsRepository.findBySlug(slug)
    if (!question) {
      throw new ResourceNotFoundError('Question')
    }
    return question
  }
}
