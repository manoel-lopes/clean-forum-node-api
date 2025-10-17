import type { PaginatedItems } from '@/core/domain/application/paginated-items'
import type { PaginationParams } from '@/core/domain/application/pagination-params'
import type { PaginationWithIncludeParams } from '@/domain/application/types/questions-include-params'
import type { Answer } from '@/domain/enterprise/entities/answer.entity'
import type { Question, QuestionProps } from '@/domain/enterprise/entities/question.entity'
import type { QuestionAttachment } from '@/domain/enterprise/entities/question-attachment.entity'
import type { QuestionComment } from '@/domain/enterprise/entities/question-comment.entity'
import type { User } from '@/domain/enterprise/entities/user.entity'

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

export type PaginatedQuestionsWithAnswers = Required<PaginatedItems<Omit<Question, 'answers'>>>

export type QuestionWithIncludes = Question & {
  comments?: QuestionComment[]
  attachments?: QuestionAttachment[]
  author?: Omit<User, 'password'>
}

export type PaginatedQuestionsWithIncludes = Required<PaginatedItems<QuestionWithIncludes>>

export type QuestionsRepository = {
  create(question: QuestionProps): Promise<Question>
  findById(questionId: string): Promise<Question | null>
  findByTitle(questionTitle: string): Promise<Question | null>
  findBySlug(params: FindQuestionBySlugParams): Promise<FindQuestionsResult | null>
  delete(questionId: string): Promise<void>
  update(questionData: UpdateQuestionData): Promise<Question>
  findMany(paginationParams: PaginationParams): Promise<PaginatedQuestions>
  findManyWithIncludes(paginationParams: PaginationWithIncludeParams): Promise<PaginatedQuestionsWithIncludes>
  findManyByUserId(userId: string, paginationParams: PaginationParams): Promise<PaginatedQuestionsWithAnswers>
}
