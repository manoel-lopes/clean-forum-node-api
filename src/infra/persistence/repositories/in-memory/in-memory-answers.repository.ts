import type {
  AnswersRepository,
  UpdateAnswerData
} from '@/application/repositories/answers.repository'
import type { Answer } from '@/domain/entities/answer/answer.entity'
import { BaseInMemoryRepository as BaseRepository } from './base/base-in-memory.repository'

export class InMemoryAnswersRepository extends BaseRepository<Answer> implements AnswersRepository {
  async update (answer: UpdateAnswerData): Promise<Answer> {
    const updatedAnswer = await this.updateOne({ id: answer.where.id, ...answer.data })
    return updatedAnswer
  }
}
