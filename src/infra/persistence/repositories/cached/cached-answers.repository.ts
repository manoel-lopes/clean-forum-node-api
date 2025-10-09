import type {
  AnswersRepository,
  UpdateAnswerData
} from '@/domain/application/repositories/answers.repository'
import { CachedAnswersMapper } from '@/infra/persistence/mappers/cached/cached-answers.mapper'
import type { RedisService } from '@/infra/providers/cache/redis-service'
import type { Answer } from '@/domain/enterprise/entities/answer.entity'

export class CachedAnswersRepository implements AnswersRepository {
  private readonly keyPrefix = 'answers'

  constructor (
    private readonly redis: RedisService,
    private readonly answersRepository: AnswersRepository
  ) {}

  async create (answer: Answer): Promise<Answer> {
    const createdAnswer = await this.answersRepository.create(answer)
    await this.redis.set(this.answerKey(createdAnswer.id), CachedAnswersMapper.toPersistence(createdAnswer))
    return createdAnswer
  }

  async update (answerData: UpdateAnswerData): Promise<Answer> {
    const updated = await this.answersRepository.update(answerData)
    await this.redis.set(this.answerKey(updated.id), CachedAnswersMapper.toPersistence(updated))
    return updated
  }

  async delete (answerId: string): Promise<void> {
    const answer = await this.answersRepository.findById(answerId)
    if (!answer) return
    await this.answersRepository.delete(answerId)
    await this.redis.delete(this.answerKey(answer.id))
  }

  async findById (answerId: string): Promise<Answer | null> {
    const cached = await this.redis.get(this.answerKey(answerId), CachedAnswersMapper.toDomain)
    if (cached) return cached
    const answer = await this.answersRepository.findById(answerId)
    if (answer) {
      await this.redis.set(this.answerKey(answer.id), CachedAnswersMapper.toPersistence(answer))
    }
    return answer
  }

  private answerKey (id: string): string {
    return this.redis.entityKey(this.keyPrefix, id)
  }
}
