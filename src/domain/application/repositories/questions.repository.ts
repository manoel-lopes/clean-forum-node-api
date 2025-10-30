import type { PaginatedItems } from '@/core/domain/application/paginated-items'
import type { PaginationParams } from '@/core/domain/application/pagination-params'
import type { AnswerIncludeOption } from '@/domain/application/types/answers-include-params'
import type {
  QuestionIncludeOption,
} from '@/domain/application/types/questions-include-params'
import type { Question, QuestionProps } from '@/domain/enterprise/entities/question.entity'

export type UpdateQuestionData = {
  where: { id: string }
  data: Partial<Omit<Question, 'id' | 'createdAt' | 'updatedAt' | 'answers' | 'comments' | 'attachments' | 'author'>>
}

export type FindQuestionBySlugParams = PaginationParams & {
  slug: string
  include?: QuestionIncludeOption[]
  answerIncludes?: AnswerIncludeOption[]
}

export type PaginatedQuestions = Required<PaginatedItems<Question>>

export type FindQuestionsResult = Question | null

export type FindManyQuestionsParams = PaginationParams & {
  include?: QuestionIncludeOption[]
}

export type QuestionsRepository = {
  create(question: QuestionProps): Promise<Question>
  findById(questionId: string): Promise<Question | null>
  findByTitle(questionTitle: string): Promise<Question | null>
  findBySlug(params: FindQuestionBySlugParams): Promise<FindQuestionsResult | null>
  delete(questionId: string): Promise<void>
  update(questionData: UpdateQuestionData): Promise<Question>
  findMany(params: FindManyQuestionsParams): Promise<PaginatedQuestions>
  findManyByUserId(userId: string, paginationParams: PaginationParams): Promise<PaginatedQuestions>
}
