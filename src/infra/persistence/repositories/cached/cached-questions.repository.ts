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
  private readonly keyPrefix = 'questions'

  constructor (
    private readonly redis: RedisService,
    private readonly questionsRepository: QuestionsRepository
  ) {}

  async save (question: Question): Promise<void> {
    await this.questionsRepository.save(question)
    await this.redis.set(this.questionKey(question.id), CachedQuestionsMapper.toPersistence(question))
  }

  async update (questionData: UpdateQuestionData): Promise<Question> {
    const updated = await this.questionsRepository.update(questionData)
    await this.redis.set(this.questionKey(updated.id), CachedQuestionsMapper.toPersistence(updated))
    return updated
  }

  async delete (questionId: string): Promise<void> {
    const question = await this.questionsRepository.findById(questionId)
    if (!question) return
    await this.questionsRepository.delete(questionId)
    await this.redis.delete(this.questionKey(question.id))
  }

  async findById (questionId: string): Promise<Question | null> {
    const cached = await this.redis.getWithFallback(this.questionKey(questionId), CachedQuestionsMapper.toDomain)
    if (cached) return cached
    const question = await this.questionsRepository.findById(questionId)
    if (question) {
      await this.redis.set(this.questionKey(question.id), CachedQuestionsMapper.toPersistence(question))
    }
    return question
  }

  async findByTitle (questionTitle: string): Promise<Question | null> {
    const cachedId = await this.redis.get(this.questionTitleKey(questionTitle))
    if (cachedId) {
      const question = await this.findById(cachedId)
      if (question) return question
      await this.redis.delete(this.questionTitleKey(questionTitle))
    }
    const question = await this.questionsRepository.findByTitle(questionTitle)
    if (question) {
      await this.redis.set(this.questionKey(question.id), CachedQuestionsMapper.toPersistence(question))
    }
    return question
  }

  async findBySlug (params: FindQuestionBySlugParams): Promise<FindQuestionsResult | null> {
    const key = this.redis.listKey(this.keyPrefix, { slug: params.slug, ...params })
    const cached = await this.redis.getWithFallback(key, CachedQuestionsMapper.toFindBySlugDomain)
    if (cached) return cached
    const result = await this.questionsRepository.findBySlug(params)
    if (result) {
      await this.redis.set(key, CachedQuestionsMapper.toFindBySlugPersistence(result))
    }
    return result
  }

  async findMany (params: PaginationParams): Promise<PaginatedQuestions> {
    const key = this.redis.listKey(this.keyPrefix, params)
    const cached = await this.redis.getWithFallback(key, CachedQuestionsMapper.toPaginatedDomain)
    if (cached) return cached
    const questions = await this.questionsRepository.findMany(params)
    await this.redis.set(key, CachedQuestionsMapper.toPaginatedPersistence(questions))
    return questions
  }

  private questionKey (id: string): string {
    return this.redis.entityKey(this.keyPrefix, id)
  }

  private questionTitleKey (title: string): string {
    return `${this.keyPrefix}:title:${title}`
  }
}
