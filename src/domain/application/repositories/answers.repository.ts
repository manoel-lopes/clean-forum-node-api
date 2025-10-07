import type { PaginationParams } from '@/core/domain/application/pagination-params'
import type { Answer, AnswerProps } from '@/domain/enterprise/entities/answer.entity'

export type FindManyByQuestionIdParams = PaginationParams & {
  questionId: string
}

export type UpdateAnswerData = {
  where: { id: string }
  data: Partial<Omit<Answer, 'id' | 'createdAt' | 'updatedAt'>>
}

export type AnswersRepository = {
  create(answer: AnswerProps): Promise<Answer>
  findById(answerId: string): Promise<Answer | null>
  delete(answerId: string): Promise<void>
  update(answerData: UpdateAnswerData): Promise<Answer>
}
