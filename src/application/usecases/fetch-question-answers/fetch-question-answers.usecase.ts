import type { PaginatedItems } from '@/core/application/paginated-items'
import type { UseCase } from '@/core/application/use-case'
import type { AnswersRepository, FindManyByQuestionIdParams } from '@/application/repositories/answers.repository'
import type { Answer } from '@/domain/entities/answer/answer.entity'

export class FetchQuestionAnswersUseCase implements UseCase {
  constructor (private readonly answersRepository: AnswersRepository) {}

  async execute ({ page, pageSize, questionId }: FindManyByQuestionIdParams): Promise<PaginatedItems<Answer>> {
    const answers = await this.answersRepository.findManyByQuestionId({ page, pageSize, questionId })
    return answers
  }
}
