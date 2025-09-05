import type {
  AnswersRepository,
  UpdateAnswerData
} from '@/application/repositories/answers.repository'
import { CachedAnswersMapper } from '@/infra/persistence/mappers/cached/cached-answers.mapper'
import type { RedisService } from '@/infra/providers/cache/redis-service'
import type { Answer } from '@/domain/entities/answer/answer.entity'

export class CachedAnswersRepository implements AnswersRepository {
  constructor (
    private readonly redis: RedisService,
    private readonly answersRepository: AnswersRepository
  ) {}

  async save (answer: Answer): Promise<void> {
    await this.answersRepository.save(answer)
    await this.redis.set(this.entityKey(answer.id), CachedAnswersMapper.toPersistence(answer))
    await this.invalidateQuestionAnswers(answer.questionId)
  }

  async update (answerData: UpdateAnswerData): Promise<Answer> {
    const updated = await this.answersRepository.update(answerData)
    await this.redis.set(this.entityKey(updated.id), CachedAnswersMapper.toPersistence(updated))
    await this.invalidateQuestionAnswers(updated.questionId)
    return updated
  }

  async delete (answerId: string): Promise<void> {
    const answer = await this.answersRepository.findById(answerId)
    if (!answer) return
    await this.answersRepository.delete(answerId)
    await this.redis.delete(this.entityKey(answer.id))
    await this.invalidateQuestionAnswers(answer.questionId)
  }

  async findById (answerId: string): Promise<Answer | null> {
    const cached = await this.redis.get(this.entityKey(answerId))
    if (cached) {
      try {
        return CachedAnswersMapper.toDomain(cached)
      } catch {
        await this.redis.delete(this.entityKey(answerId))
      }
    }
    const answer = await this.answersRepository.findById(answerId)
    if (answer) {
      await this.redis.set(this.entityKey(answer.id), CachedAnswersMapper.toPersistence(answer))
    }
    return answer
  }

  private entityKey (id: string) {
    return `answers:${id}`
  }

  private questionAnswersKey (questionId: string) {
    return `answers:question:${questionId}:*`
  }

  private async invalidateQuestionAnswers (questionId: string) {
    const keys = await this.redis.keys(this.questionAnswersKey(questionId))
    if (keys.length) {
      await this.redis.delete(...keys)
    }
  }
}
