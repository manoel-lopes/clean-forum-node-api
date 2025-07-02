import { Question } from '@domain/entities/question/question.entity'
import { QuestionsRepository } from '@application/repositories/questions.repository'
import { PaginationParams } from '@core/application/pagination-params'
import { PaginatedItems } from '@core/application/paginated-items'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  public async create (question: Question): Promise<void> {
    this.items.push(question)
  }

  public async findBySlug (slug: string): Promise<Question | null> {
    const question = this.items.find((question) => question.slug.value === slug)

    if (!question) {
      return null
    }

    return question
  }

  public async findById (id: string): Promise<Question | null> {
    const question = this.items.find((item) => item.id === id)

    if (!question) {
      return null
    }

    return question
  }

  public async findManyRecent ({ page }: PaginationParams): Promise<PaginatedItems<Question>> {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return new PaginatedItems(questions, this.items.length)
  }

  public async save (question: Question): Promise<void> {
    const questionIndex = this.items.findIndex((item) => item.id === question.id)

    if (questionIndex >= 0) {
      this.items[questionIndex] = question
    }
  }

  public async delete (id: string): Promise<void> {
    const questionIndex = this.items.findIndex((item) => item.id === id)

    if (questionIndex >= 0) {
      this.items.splice(questionIndex, 1)
    }
  }
}
