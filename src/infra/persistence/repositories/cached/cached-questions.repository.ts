import type { PaginationParams } from '@/core/domain/application/pagination-params'
import type {
  FindQuestionBySlugParams,
  FindQuestionsResult,
  PaginatedQuestions,
  QuestionsRepository,
  UpdateQuestionData
} from '@/domain/application/repositories/questions.repository'
import { CachedQuestionsMapper } from '@/infra/persistence/mappers/cached/cached-questions.mapper'
import type { RedisService } from '@/infra/providers/cache/redis-service'
import type { Question } from '@/domain/enterprise/entities/question.entity'

export class CachedQuestionsRepository implements QuestionsRepository {
  private readonly keyPrefix = 'questions'

  constructor (
    private readonly redis: RedisService,
    private readonly questionsRepository: QuestionsRepository
  ) {}

  async create (question: Question): Promise<void> {
    await this.questionsRepository.create(question)
    const questionData = CachedQuestionsMapper.toPersistence(question)
    await this.redis.set(this.questionKey(question.id), questionData)
    await this.redis.set(this.questionTitleKey(question.title), questionData)
  }

  async update (questionData: UpdateQuestionData): Promise<Question> {
    const oldQuestion = await this.questionsRepository.findById(questionData.where.id)
    const updated = await this.questionsRepository.update(questionData)
    const cachedData = CachedQuestionsMapper.toPersistence(updated)
    await this.redis.set(this.questionKey(updated.id), cachedData)
    await this.redis.set(this.questionTitleKey(updated.title), cachedData)
    if (oldQuestion && oldQuestion.title !== updated.title) {
      await this.redis.delete(this.questionTitleKey(oldQuestion.title))
    }
    return updated
  }

  async delete (questionId: string): Promise<void> {
    const question = await this.questionsRepository.findById(questionId)
    await this.questionsRepository.delete(questionId)
    await this.redis.delete(this.questionKey(questionId))
    if (question) {
      await this.redis.delete(this.questionTitleKey(question.title))
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
    const key = this.redis.listKey(this.keyPrefix, { slug: params.slug, ...params })
    const cached = await this.redis.get(key, CachedQuestionsMapper.toFindBySlugDomain)
    if (cached) return cached
    const result = await this.questionsRepository.findBySlug(params)
    if (result) {
      await this.redis.set(key, CachedQuestionsMapper.toFindBySlugPersistence(result))
    }
    return result
  }

  async findMany (params: PaginationParams): Promise<PaginatedQuestions> {
    const key = this.redis.listKey(this.keyPrefix, params)
    const cached = await this.redis.get(key, CachedQuestionsMapper.toPaginatedDomain)
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
