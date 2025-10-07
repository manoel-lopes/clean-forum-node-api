import { uuidv7 } from 'uuidv7'
import type {
  AnswersRepository,
  UpdateAnswerData
} from '@/domain/application/repositories/answers.repository'
import type { Answer, AnswerProps } from '@/domain/enterprise/entities/answer.entity'
import { BaseInMemoryRepository as BaseRepository } from './base/base-in-memory.repository'

export class InMemoryAnswersRepository extends BaseRepository<Answer> implements AnswersRepository {
  async save (data: AnswerProps): Promise<Answer> {
    const excerpt = data.excerpt ?? data.content.substring(0, 45).replace(/ $/, '').concat('...')
    const answer: Answer = {
      id: uuidv7(),
      createdAt: new Date(),
      updatedAt: new Date(),
      excerpt,
      ...data
    }
    this.items.push(answer)
    return answer
  }

  async update (answer: UpdateAnswerData): Promise<Answer> {
    const updatedAnswer = await this.updateOne(answer)
    return updatedAnswer
  }
}
