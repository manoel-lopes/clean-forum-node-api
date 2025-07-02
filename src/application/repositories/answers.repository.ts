import type { Answer } from '@/domain/entities/answer/answer.entity'

export type AnswersRepository = {
  save: (answer: Answer) => Promise<void>
  findById(answerId: string): Promise<Answer | null>
  delete: (answerId: string) => Promise<void>
}
