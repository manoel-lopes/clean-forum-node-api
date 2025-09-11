import type {
  AnswersRepository,
  UpdateAnswerData
} from '@/application/repositories/answers.repository'
import { CachedAnswersMapper } from '@/infra/persistence/mappers/cached/cached-answers.mapper'
import type { RedisService } from '@/infra/providers/cache/redis-service'
import type { Answer } from '@/domain/entities/answer/answer.entity'
import { BaseCachedRepository } from './base/base-cached.repository'

export class CachedAnswersRepository extends BaseCachedRepository implements AnswersRepository {
  private readonly keyPrefix = 'answers'

  constructor (
    redis: RedisService,
    private readonly answersRepository: AnswersRepository
  ) {
    super(redis)
  }

  private answerKey (id: string): string {
    return this.entityKey(this.keyPrefix, id)
  }

  async save (answer: Answer): Promise<void> {
    await this.answersRepository.save(answer)
    await this.cacheSet(this.answerKey(answer.id), CachedAnswersMapper.toPersistence(answer))
  }

  async update (answerData: UpdateAnswerData): Promise<Answer> {
    const updated = await this.answersRepository.update(answerData)
    await this.cacheSet(this.answerKey(updated.id), CachedAnswersMapper.toPersistence(updated))
    return updated
  }

  async delete (answerId: string): Promise<void> {
    const answer = await this.answersRepository.findById(answerId)
    if (!answer) return
    await this.answersRepository.delete(answerId)
    await this.cacheDelete(this.answerKey(answer.id))
  }

  async findById (answerId: string): Promise<Answer | null> {
    const cached = await this.cacheGet(this.answerKey(answerId))
    if (cached) {
      try {
        return CachedAnswersMapper.toDomain(cached)
      } catch {
        await this.cacheDelete(this.answerKey(answerId))
      }
    }
    const answer = await this.answersRepository.findById(answerId)
    if (answer) {
      await this.cacheSet(this.answerKey(answer.id), CachedAnswersMapper.toPersistence(answer))
    }
    return answer
  }
}
