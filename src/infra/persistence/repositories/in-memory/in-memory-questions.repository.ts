import type { PaginatedItems } from '@/core/application/paginated-items'
import type { PaginationParams } from '@/core/application/pagination-params'
import type {
  FindQuestionBySlugParams,
  FindQuestionsResult,
  QuestionsRepository,
  UpdateQuestionData
} from '@/application/repositories/questions.repository'
import { Question } from '@/domain/entities/question/question.entity'
import { BaseInMemoryRepository as BaseRepository } from './base/base-in-memory.repository'

export class InMemoryQuestionsRepository
  extends BaseRepository<Question>
  implements QuestionsRepository {
  async update (questionData: UpdateQuestionData): Promise<Question> {
    const question = await this.updateOne({
      where: { id: questionData.where.id },
      data: questionData.data
    })
    return question
  }

  async findById (questionId: string): Promise<Question | null> {
    return this.findOneBy('id', questionId)
  }

  async findByTitle (title: string): Promise<Question | null> {
    return this.findOneBy('title', title)
  }

  async findBySlug ({ slug, page = 1, pageSize = 10, order = 'desc' }: FindQuestionBySlugParams): Promise<FindQuestionsResult> {
    const question = await this.findOneBy('slug', slug)
    if (!question) {
      return null
    }
    return {
      ...question,
      answers: this.paginate({
        items: question.answers,
        page,
        pageSize,
        order,
      }),
    }
  }

  async findMany ({
    page = 1,
    pageSize = 10,
    order = 'desc'
  }: PaginationParams): Promise<PaginatedItems<Question>> {
    const questions = await this.findManyItems({ page, pageSize, order })
    return questions
  }
}
