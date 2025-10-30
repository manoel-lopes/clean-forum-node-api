import type { PaginatedItems } from '@/core/domain/application/paginated-items'
import type { PaginationParams } from '@/core/domain/application/pagination-params'
import type { AnswerIncludeOption } from '@/domain/application/types/answers-include-params'
import type { Answer, AnswerProps } from '@/domain/enterprise/entities/answer.entity'

export type FindManyByQuestionIdParams = PaginationParams & {
  questionId: string
  include?: AnswerIncludeOption[]
}

export type UpdateAnswerData = {
  where: { id: string }
  data: Partial<Omit<Answer, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'attachments' | 'author'>>
}

export type PaginatedAnswers = Required<PaginatedItems<Answer>>

export type AnswersRepository = {
  create(answer: AnswerProps): Promise<Answer>
  findById(answerId: string): Promise<Answer | null>
  delete(answerId: string): Promise<void>
  update(answerData: UpdateAnswerData): Promise<Answer>
  findManyByQuestionId(params: FindManyByQuestionIdParams): Promise<PaginatedAnswers>
}
