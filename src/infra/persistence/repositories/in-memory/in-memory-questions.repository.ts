import type {
  QuestionsRepository,
  UpdateQuestionData
} from '@/application/repositories/questions.repository'
import { Question } from '@/domain/entities/question/question.entity'
import { BaseInMemoryRepository as BaseRepository } from './base/base-in-memory.repository'

export class InMemoryQuestionsRepository
  extends BaseRepository<Question>
  implements QuestionsRepository {
  async findByTitle (questionTitle: string): Promise<Question | null> {
    const question = await this.findOneBy('title', questionTitle)
    return question
  }

  async findBySlug (slug: string): Promise<Question | null> {
    const question = await this.findOneBy('slug', slug)
    return question
  }

  async update (questionData: UpdateQuestionData): Promise<Question> {
    return this.updateOne(questionData)
  }
}
