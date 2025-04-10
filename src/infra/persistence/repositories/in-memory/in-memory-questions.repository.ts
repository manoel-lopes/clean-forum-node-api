import type { QuestionsRepository } from '@/application/repositories/questions.repository'
import { Question } from '@/domain/entities/question/question.entity'
import { BaseInMemoryRepository as BaseRepository } from './base/base-in-memory.repository'

export class InMemoryQuestionsRepository
  extends BaseRepository<Question>
  implements QuestionsRepository {
  async delete (questionId: string): Promise<void> {
    await this.deleteOneBy('id', questionId)
  }

  async findByTitle (questionTitle: string): Promise<Question | null> {
    const question = await this.findOneBy('title', questionTitle)
    return question
  }
}
