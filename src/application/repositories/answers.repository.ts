import { Answer } from '@domain/entities/answer/answer.entity'
import { PaginationParams } from '@core/application/pagination-params'
import { PaginatedItems } from '@core/application/paginated-items'

export interface AnswersRepository {
  create(answer: Answer): Promise<void>
  findById(id: string): Promise<Answer | null>
  findManyByQuestionId(questionId: string, params: PaginationParams): Promise<PaginatedItems<Answer>>
  save(answer: Answer): Promise<void>
  delete(id: string): Promise<void>
}
