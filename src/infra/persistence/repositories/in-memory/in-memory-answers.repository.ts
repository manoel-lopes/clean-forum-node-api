import { Answer } from '@domain/entities/answer/answer.entity'
import { AnswersRepository } from '@application/repositories/answers.repository'
import { PaginationParams } from '@core/application/pagination-params'
import { PaginatedItems } from '@core/application/paginated-items'

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []

  public async create (answer: Answer): Promise<void> {
    this.items.push(answer)
  }

  public async findById (id: string): Promise<Answer | null> {
    const answer = this.items.find((item) => item.id === id)

    if (!answer) {
      return null
    }

    return answer
  }

  public async findManyByQuestionId (questionId: string, { page }: PaginationParams): Promise<PaginatedItems<Answer>> {
    const answers = this.items
      .filter((item) => item.questionId === questionId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return new PaginatedItems(answers, this.items.length)
  }

  public async save (answer: Answer): Promise<void> {
    const answerIndex = this.items.findIndex((item) => item.id === answer.id)

    if (answerIndex >= 0) {
      this.items[answerIndex] = answer
    }
  }

  public async delete (id: string): Promise<void> {
    const answerIndex = this.items.findIndex((item) => item.id === id)

    if (answerIndex >= 0) {
      this.items.splice(answerIndex, 1)
    }
  }
}
