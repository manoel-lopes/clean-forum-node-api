import type { PaginationParams } from '@/core/application/pagination-params'
import type {
  FindQuestionBySlugParams,
  FindQuestionsResult,
  PaginatedQuestions,
  QuestionsRepository,
  UpdateQuestionData
} from '@/application/repositories/questions.repository'
import { CachedQuestionsMapper } from '@/infra/persistence/mappers/cached/cached-questions.mapper'
import type { RedisService } from '@/infra/providers/cache/redis-service'
import type { Question } from '@/domain/entities/question/question.entity'

export class CachedQuestionsRepository implements QuestionsRepository {
  constructor (
    private readonly redis: RedisService,
    private readonly questionsRepository: QuestionsRepository
  ) {}

  async save (question: Question): Promise<void> {
    await this.questionsRepository.save(question)
    await this.redis.set(this.entityKey(question.id), CachedQuestionsMapper.toPersistence(question))
    await this.redis.set(this.titleKey(question.title), CachedQuestionsMapper.toPersistence(question))
    await this.redis.set(this.slugKey(question.slug), CachedQuestionsMapper.toPersistence(question))
    await this.invalidatePagination()
  }

  async update (questionData: UpdateQuestionData): Promise<Question> {
    const updated = await this.questionsRepository.update(questionData)
    await this.redis.set(this.entityKey(updated.id), CachedQuestionsMapper.toPersistence(updated))
    await this.redis.set(this.titleKey(updated.title), CachedQuestionsMapper.toPersistence(updated))
    await this.redis.set(this.slugKey(updated.slug), CachedQuestionsMapper.toPersistence(updated))
    await this.invalidatePagination()
    return updated
  }

  async delete (questionId: string): Promise<void> {
    const question = await this.questionsRepository.findById(questionId)
    if (!question) return
    await this.questionsRepository.delete(questionId)
    await this.redis.delete(this.entityKey(question.id))
    await this.redis.delete(this.titleKey(question.title))
    await this.redis.delete(this.slugKey(question.slug))
    await this.invalidatePagination()
  }

  async findById (questionId: string): Promise<Question | null> {
    const cached = await this.redis.get(this.entityKey(questionId))
    if (cached) {
      try {
        return CachedQuestionsMapper.toDomain(cached)
      } catch {
        await this.redis.delete(this.entityKey(questionId))
      }
    }
    const question = await this.questionsRepository.findById(questionId)
    if (question) {
      await this.redis.set(this.entityKey(question.id), CachedQuestionsMapper.toPersistence(question))
      await this.redis.set(this.titleKey(question.title), CachedQuestionsMapper.toPersistence(question))
      await this.redis.set(this.slugKey(question.slug), CachedQuestionsMapper.toPersistence(question))
    }
    return question
  }

  async findByTitle (questionTitle: string): Promise<Question | null> {
    const cached = await this.redis.get(this.titleKey(questionTitle))
    if (cached) {
      try {
        return CachedQuestionsMapper.toDomain(cached)
      } catch {
        await this.redis.delete(this.titleKey(questionTitle))
      }
    }
    const question = await this.questionsRepository.findByTitle(questionTitle)
    if (question) {
      await this.redis.set(this.entityKey(question.id), CachedQuestionsMapper.toPersistence(question))
      await this.redis.set(this.titleKey(question.title), CachedQuestionsMapper.toPersistence(question))
      await this.redis.set(this.slugKey(question.slug), CachedQuestionsMapper.toPersistence(question))
    }
    return question
  }

  async findBySlug (params: FindQuestionBySlugParams): Promise<FindQuestionsResult | null> {
    // For complex queries with pagination, we don't cache for now
    // This could be enhanced with more sophisticated cache key generation
    return await this.questionsRepository.findBySlug(params)
  }

  async findMany (params: PaginationParams): Promise<PaginatedQuestions> {
    const key = this.paginationKey(params)
    const cached = await this.redis.get(key)
    if (cached) {
      try {
        return CachedQuestionsMapper.toPaginatedDomain(cached)
      } catch {
        await this.redis.delete(key)
      }
    }
    const questions = await this.questionsRepository.findMany(params)
    await this.redis.set(key, CachedQuestionsMapper.toPaginatedPersistence(questions))
    await this.redis.sadd(this.paginationKeysSet(), key)
    return questions
  }

  private entityKey (id: string) {
    return `questions:${id}`
  }

  private titleKey (title: string) {
    return `questions:title:${title}`
  }

  private slugKey (slug: string) {
    return `questions:slug:${slug}`
  }

  private paginationKey (params: PaginationParams) {
    const order = params.order ?? 'desc'
    return `questions:pagination:page=${params.page}:size=${params.pageSize}:order=${order}`
  }

  private paginationKeysSet () {
    return 'questions:pagination:keys'
  }

  private async invalidatePagination () {
    const keys = await this.redis.smembers(this.paginationKeysSet())
    if (keys.length) {
      await this.redis.delete(...keys)
      await this.redis.delete(this.paginationKeysSet())
    }
  }
}
