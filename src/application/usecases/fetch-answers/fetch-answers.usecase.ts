import type { PaginatedItems } from '@/core/application/paginated-items'
import type { PaginationParams } from '@/core/application/pagination-params'
import type { UseCase } from '@/core/application/use-case'

import type { AnswersRepository } from '@/application/repositories/answers.repository'

import type { Answer } from '@/domain/entities/answer/answer.entity'

export class FetchAnswersUseCase implements UseCase {
  constructor (private readonly answersRepository: AnswersRepository) {}

  async execute ({ page, pageSize }: PaginationParams): Promise<PaginatedItems<Answer>> {
    const answers = await this.answersRepository.findMany({ page, pageSize })
    return answers
  }
}
