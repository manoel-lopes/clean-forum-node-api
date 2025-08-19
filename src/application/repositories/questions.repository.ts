import type { PaginatedItems } from '@/core/application/paginated-items'
import type { PaginationParams } from '@/core/application/pagination-params'
import type { Answer } from '@/domain/entities/answer/answer.entity'
import type { Question } from '@/domain/entities/question/question.entity'

export type UpdateQuestionData = {
  id: string
  title?: string
  content?: string
  bestAnswerId?: string
}

export type FindQuestionBySlugParams = PaginationParams & {
  slug?: string
}

export type FindQuestionsResult = Omit<Question, 'answers'> & {
  answers: PaginatedItems<Answer>
} | null

export type QuestionsRepository = {
  save(question: Question): Promise<void>
  findById(questionId: string): Promise<Question | null>
  findByTitle(questionTitle: string): Promise<Question | null>
  findBySlug(params: FindQuestionBySlugParams): Promise<FindQuestionsResult | null>
  delete(questionId: string): Promise<void>
  update(questionData: UpdateQuestionData): Promise<Question>
  findMany(paginationParams: PaginationParams): Promise<PaginatedItems<Question>>
}
