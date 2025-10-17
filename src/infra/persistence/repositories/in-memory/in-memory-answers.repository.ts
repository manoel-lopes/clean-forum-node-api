import type { AnswersRepository, UpdateAnswerData } from '@/domain/application/repositories/answers.repository'
import type { Answer } from '@/domain/enterprise/entities/answer.entity'
import { BaseInMemoryRepository as BaseRepository } from './base/base-in-memory.repository'

export class InMemoryAnswersRepository extends BaseRepository<Answer> implements AnswersRepository {
  async update(answerData: UpdateAnswerData): Promise<Answer> {
    const updatedAnswer = await this.updateOne(answerData)
    return updatedAnswer
  }
}
