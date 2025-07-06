import type { Question } from '@/domain/entities/question/question.entity'

export type UpdateQuestionData = {
  id: string
  title?: string
  content?: string
  bestAnswerId?: string
}

export type QuestionsRepository = {
  save(question: Question): Promise<void>
  findById(questionId: string): Promise<Question | null>
  findByTitle(title: string): Promise<Question | null>
  findBySlug(slug: string): Promise<Question | null>
  delete(questionId: string): Promise<void>
  update(questionData: UpdateQuestionData): Promise<Question>
}
