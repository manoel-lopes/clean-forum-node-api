import type { PaginatedItems } from '@/core/application/paginated-items'
import type { PaginationParams } from '@/core/application/pagination-params'
import type { Question } from '@/infra/persistence/typeorm/data-mappers/question/question.mapper'

export type UpdateQuestionData = {
  id: string
  title?: string
  content?: string
  bestAnswerId?: string
}

export type PaginatedQuestions = PaginatedItems<Question>

export type QuestionsRepository = {
  save: (question: Question) => Promise<void>
  findById(questionId: string): Promise<Question | null>
  delete(questionId: string): Promise<void>
  findBySlug(slug: string): Promise<Question | null>
  findByTitle(title: string): Promise<Question | null>
  findMany(params: PaginationParams): Promise<PaginatedQuestions>
  update(questionData: UpdateQuestionData): Promise<Question>
}
