import type { PaginatedItems } from '@/core/domain/application/paginated-items'
import type { PaginationParams } from '@/core/domain/application/pagination-params'
import type { Question, QuestionProps } from '@/domain/enterprise/entities/question.entity'
import type { QuestionAttachment } from '@/domain/enterprise/entities/question-attachment.entity'
import type { QuestionComment } from '@/domain/enterprise/entities/question-comment.entity'
import type { User } from '@/domain/enterprise/entities/user.entity'
import type { PaginatedAnswers } from './answers.repository'
import type { IncludeOption } from './base/querys'

export type PaginationWithIncludeParams = PaginationParams & {
  include?: IncludeOption[]
}

export type UpdateQuestionData = {
  where: { id: string }
  data: Partial<Omit<Question, 'id' | 'createdAt' | 'updatedAt'>>
}

export type FindQuestionBySlugParams = PaginationParams & {
  slug: string
  include?: IncludeOption[]
  answerIncludes?: IncludeOption[]
}

export type QuestionWithRelations = Question & {
  answers?: PaginatedAnswers
  comments?: QuestionComment[]
  attachments?: QuestionAttachment[]
  author?: Omit<User, 'password'>
}

export type PaginatedQuestions = Required<PaginatedItems<QuestionWithRelations>>

export type FindQuestionsResult = Question | null

export type FindManyQuestionsParams = PaginationParams & {
  include?: IncludeOption[]
}

export type QuestionsRepository = {
  create(question: QuestionProps): Promise<Question>
  findById(questionId: string): Promise<Question | null>
  findByTitle(questionTitle: string): Promise<Question | null>
  findBySlug(params: FindQuestionBySlugParams): Promise<FindQuestionsResult | null>
  delete(questionId: string): Promise<void>
  update(questionData: UpdateQuestionData): Promise<Question>
  findMany(params: FindManyQuestionsParams): Promise<PaginatedQuestions>
  findManyByUserId(userId: string, params: PaginationWithIncludeParams): Promise<PaginatedQuestions>
}
