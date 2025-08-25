import type { PaginatedItems } from '@/core/application/paginated-items'
import type { PaginationParams } from '@/core/application/pagination-params'
import type { Answer } from '@/domain/entities/answer/answer.entity'
import type { Question } from '@/domain/entities/question/question.entity'

export type UpdateQuestionData = {
  where: { id: string }
  data: Partial<Omit<Question, 'id' | 'createdAt' | 'updatedAt'>>
}

export type FindQuestionBySlugParams = PaginationParams & {
  slug?: string
}

export type FindQuestionsResult = Omit<Question, 'answers'> & {
  answers: PaginatedItems<Answer>
} | null

export type PaginatedQuestions = Required<PaginatedItems<Question>>

export type QuestionsRepository = {
  save(question: Question): Promise<void>
  findById(questionId: string): Promise<Question | null>
  findByTitle(questionTitle: string): Promise<Question | null>
  findBySlug(params: FindQuestionBySlugParams): Promise<FindQuestionsResult | null>
  delete(questionId: string): Promise<void>
  update(questionData: UpdateQuestionData): Promise<Question>
  findMany(paginationParams: PaginationParams): Promise<PaginatedQuestions>
}
