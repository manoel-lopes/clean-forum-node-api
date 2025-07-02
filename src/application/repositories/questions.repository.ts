import { Question } from '@domain/entities/question/question.entity'
import { PaginationParams } from '@core/application/pagination-params'
import { PaginatedItems } from '@core/application/paginated-items'

export interface QuestionsRepository {
  create(question: Question): Promise<void>
  findBySlug(slug: string): Promise<Question | null>
  findById(id: string): Promise<Question | null>
  findManyRecent(params: PaginationParams): Promise<PaginatedItems<Question>>
  save(question: Question): Promise<void>
  delete(id: string): Promise<void>
}
