import type { PaginationParams } from '@/core/domain/application/pagination-params'
import type {
  FindQuestionBySlugParams,
  FindQuestionsResult,
  PaginatedQuestions,
  PaginatedQuestionsWithAnswers,
  PaginatedQuestionsWithIncludes,
  QuestionsRepository,
  UpdateQuestionData,
} from '@/domain/application/repositories/questions.repository'
import type { PaginationWithIncludeParams } from '@/domain/application/types/questions-include-params'
import { CachedQuestionsMapper } from '@/infra/persistence/mappers/cached/cached-questions.mapper'
import type { RedisService } from '@/infra/providers/cache/redis-service'
import type { Question } from '@/domain/enterprise/entities/question.entity'

export class CachedQuestionsRepository implements QuestionsRepository {
  private readonly keyPrefix = 'questions'

  constructor (
    private readonly redis: RedisService,
    private readonly questionsRepository: QuestionsRepository
  ) {}

  async create (question: Question): Promise<Question> {
    const createdQuestion = await this.questionsRepository.create(question)
    const questionData = CachedQuestionsMapper.toPersistence(createdQuestion)
    await this.redis.set(this.questionKey(createdQuestion.id), questionData)
    await this.redis.set(this.questionTitleKey(createdQuestion.title), questionData)
    await this.invalidateListCaches(createdQuestion.authorId)
    return createdQuestion
  }

  async update (questionData: UpdateQuestionData): Promise<Question> {
    const oldQuestion = await this.questionsRepository.findById(questionData.where.id)
    const updated = await this.questionsRepository.update(questionData)
    const cachedData = CachedQuestionsMapper.toPersistence(updated)
    await this.redis.set(this.questionKey(updated.id), cachedData)
    await this.redis.set(this.questionTitleKey(updated.title), cachedData)
    if (oldQuestion) {
      if (oldQuestion.title !== updated.title) {
        await this.redis.delete(this.questionTitleKey(oldQuestion.title))
      }
      if (oldQuestion.slug !== updated.slug) {
        await this.redis.deletePattern(`${this.keyPrefix}:slug:${oldQuestion.slug}:*`)
      }
      await this.invalidateListCaches(updated.authorId)
    }
    await this.redis.deletePattern(`${this.keyPrefix}:slug:${updated.slug}:*`)
    return updated
  }

  async delete (questionId: string): Promise<void> {
    const question = await this.questionsRepository.findById(questionId)
    await this.questionsRepository.delete(questionId)
    await this.redis.delete(this.questionKey(questionId))
    if (question) {
      await this.redis.delete(this.questionTitleKey(question.title))
      await this.redis.deletePattern(`${this.keyPrefix}:slug:${question.slug}:*`)
      await this.invalidateListCaches(question.authorId)
    }
  }

  async findById (questionId: string): Promise<Question | null> {
    const cached = await this.redis.get(this.questionKey(questionId), CachedQuestionsMapper.toDomain)
    if (cached) return cached
    const question = await this.questionsRepository.findById(questionId)
    if (question) {
      const questionData = CachedQuestionsMapper.toPersistence(question)
      await this.redis.set(this.questionKey(question.id), questionData)
      await this.redis.set(this.questionTitleKey(question.title), questionData)
    }
    return question
  }

  async findByTitle (questionTitle: string): Promise<Question | null> {
    const cached = await this.redis.get(this.questionTitleKey(questionTitle), CachedQuestionsMapper.toDomain)
    if (cached) return cached
    const question = await this.questionsRepository.findByTitle(questionTitle)
    if (question) {
      const questionData = CachedQuestionsMapper.toPersistence(question)
      await this.redis.set(this.questionKey(question.id), questionData)
      await this.redis.set(this.questionTitleKey(question.title), questionData)
    }
    return question
  }

  async findBySlug (params: FindQuestionBySlugParams): Promise<FindQuestionsResult | null> {
    const key = this.redis.listKey(this.keyPrefix, params)
    const cached = await this.redis.get(key, CachedQuestionsMapper.toFindBySlugDomain)
    if (cached) return cached
    const response = await this.questionsRepository.findBySlug(params)
    if (response) {
      await this.redis.set(key, CachedQuestionsMapper.toFindBySlugPersistence(response))
    }
    return response
  }

  async findMany (params: PaginationParams): Promise<PaginatedQuestions> {
    const key = this.redis.listKey(this.keyPrefix, params)
    const cached = await this.redis.get(key, CachedQuestionsMapper.toPaginatedDomain)
    if (cached) return cached
    const questions = await this.questionsRepository.findMany(params)
    await this.redis.set(key, CachedQuestionsMapper.toPaginatedPersistence(questions))
    return questions
  }

  async findManyWithIncludes (params: PaginationWithIncludeParams): Promise<PaginatedQuestionsWithIncludes> {
    const key = this.redis.listKey(`${this.keyPrefix}:includes`, params)
    const cached = await this.redis.get(key, CachedQuestionsMapper.toPaginatedWithIncludesDomain)
    if (cached) return cached
    const questions = await this.questionsRepository.findManyWithIncludes(params)
    await this.redis.set(key, CachedQuestionsMapper.toPaginatedWithIncludesPersistence(questions))
    return questions
  }

  async findManyByUserId (userId: string, params: PaginationParams): Promise<PaginatedQuestionsWithAnswers> {
    const key = this.redis.listKey(`${this.keyPrefix}:user:${userId}`, params)
    const cached = await this.redis.get(key, CachedQuestionsMapper.toPaginatedDomain)
    if (cached) return cached
    const questions = await this.questionsRepository.findManyByUserId(userId, params)
    await this.redis.set(key, CachedQuestionsMapper.toPaginatedPersistence(questions))
    return questions
  }

  private questionKey (id: string): string {
    return this.redis.entityKey(this.keyPrefix, id)
  }

  private questionTitleKey (title: string): string {
    return `${this.keyPrefix}:title:${title}`
  }

  private async invalidateListCaches (userId: string): Promise<void> {
    await this.redis.deletePattern(`${this.keyPrefix}:list:*`)
    await this.redis.deletePattern(`${this.keyPrefix}:includes:list:*`)
    await this.redis.deletePattern(`${this.keyPrefix}:user:${userId}:list:*`)
  }
}
