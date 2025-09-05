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
import { BaseCachedRepository } from './base-cached.repository'

export class CachedQuestionsRepository extends BaseCachedRepository implements QuestionsRepository {
  constructor (
    redis: RedisService,
    private readonly questionsRepository: QuestionsRepository
  ) {
    super(redis)
  }

  async save (question: Question): Promise<void> {
    await this.questionsRepository.save(question)
    await this.cacheSet(this.entityKey('questions', question.id), CachedQuestionsMapper.toPersistence(question))
    await this.invalidatePattern('questions:list:*')
  }

  async update (questionData: UpdateQuestionData): Promise<Question> {
    const updated = await this.questionsRepository.update(questionData)
    await this.cacheSet(this.entityKey('questions', updated.id), CachedQuestionsMapper.toPersistence(updated))
    await this.invalidatePattern('questions:list:*')
    return updated
  }

  async delete (questionId: string): Promise<void> {
    const question = await this.questionsRepository.findById(questionId)
    if (!question) return
    await this.questionsRepository.delete(questionId)
    await this.cacheDelete(this.entityKey('questions', question.id))
    await this.invalidatePattern('questions:list:*')
    await this.invalidatePattern(`answers:list:questionId=${questionId}:*`)
  }

  async findById (questionId: string): Promise<Question | null> {
    const cached = await this.cacheGet(this.entityKey('questions', questionId))
    if (cached) {
      try {
        return CachedQuestionsMapper.toDomain(cached)
      } catch {
        await this.cacheDelete(this.entityKey('questions', questionId))
      }
    }
    const question = await this.questionsRepository.findById(questionId)
    if (question) {
      await this.cacheSet(this.entityKey('questions', question.id), CachedQuestionsMapper.toPersistence(question))
    }
    return question
  }

  async findByTitle (questionTitle: string): Promise<Question | null> {
    const question = await this.questionsRepository.findByTitle(questionTitle)
    if (question) {
      await this.cacheSet(this.entityKey('questions', question.id), CachedQuestionsMapper.toPersistence(question))
    }
    return question
  }

  async findBySlug (params: FindQuestionBySlugParams): Promise<FindQuestionsResult | null> {
    const key = this.listKey('questions:slug', { slug: params.slug, ...params })
    const cached = await this.cacheGet(key)
    if (cached) {
      try {
        return JSON.parse(cached) as FindQuestionsResult
      } catch {
        await this.cacheDelete(key)
      }
    }
    const response = await this.questionsRepository.findBySlug(params)
    if (response) {
      await this.cacheSet(key, JSON.stringify(response))
    }
    return response
  }

  async findMany (params: PaginationParams): Promise<PaginatedQuestions> {
    const key = this.listKey('questions', params)
    const cached = await this.cacheGet(key)
    if (cached) {
      try {
        return CachedQuestionsMapper.toPaginatedDomain(cached)
      } catch {
        await this.cacheDelete(key)
      }
    }
    const questions = await this.questionsRepository.findMany(params)
    await this.cacheSet(key, CachedQuestionsMapper.toPaginatedPersistence(questions))
    return questions
  }
}
