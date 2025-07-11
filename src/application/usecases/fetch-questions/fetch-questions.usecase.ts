import type { PaginatedItems } from '@/core/application/paginated-items'
import type { PaginationParams } from '@/core/application/pagination-params'
import type { UseCase } from '@/core/application/use-case'

import type { QuestionsRepository } from '@/application/repositories/questions.repository'

import type { Question } from '@/domain/entities/question/question.entity'

export class FetchQuestionsUseCase implements UseCase {
  constructor (private readonly questionsRepository: QuestionsRepository) {}

  async execute (paginationParams: PaginationParams): Promise<PaginatedItems<Question>> {
    const questions = await this.questionsRepository.findMany(paginationParams)
    return questions
  }
}
