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
import { BaseCachedRepository } from './base/base-cached.repository'

export class CachedQuestionsRepository extends BaseCachedRepository implements QuestionsRepository {
  private readonly keyPrefix = 'questions'

  constructor (
    redis: RedisService,
    private readonly questionsRepository: QuestionsRepository
  ) {
    super(redis)
  }

  private questionKey (id: string): string {
    return this.entityKey(this.keyPrefix, id)
  }

  private questionTitleKey (title: string): string {
    return this.titleKey(title)
  }

  private questionSlugKey (slug: string): string {
    return this.slugKey(slug)
  }

  private questionsListKey (params: Record<string, unknown>): string {
    return this.listKey(this.keyPrefix, params)
  }

  async save (question: Question): Promise<void> {
    await this.questionsRepository.save(question)
    await this.cacheSet(this.questionKey(question.id), CachedQuestionsMapper.toPersistence(question))
    await this.cacheSet(this.questionTitleKey(question.title), CachedQuestionsMapper.toPersistence(question))
    await this.cacheSet(this.questionSlugKey(question.slug), CachedQuestionsMapper.toPersistence(question))
  }

  async update (questionData: UpdateQuestionData): Promise<Question> {
    const updated = await this.questionsRepository.update(questionData)
    await this.cacheSet(this.questionKey(updated.id), CachedQuestionsMapper.toPersistence(updated))
    await this.cacheSet(this.questionTitleKey(updated.title), CachedQuestionsMapper.toPersistence(updated))
    await this.cacheSet(this.questionSlugKey(updated.slug), CachedQuestionsMapper.toPersistence(updated))
    return updated
  }

  async delete (questionId: string): Promise<void> {
    const question = await this.questionsRepository.findById(questionId)
    if (!question) return
    await this.questionsRepository.delete(questionId)
    await this.cacheDelete(this.questionKey(question.id))
    await this.cacheDelete(this.questionTitleKey(question.title))
    await this.cacheDelete(this.questionSlugKey(question.slug))
  }

  async findById (questionId: string): Promise<Question | null> {
    const cached = await this.cacheGet(this.questionKey(questionId))
    if (cached) {
      try {
        return CachedQuestionsMapper.toDomain(cached)
      } catch {
        await this.cacheDelete(this.questionKey(questionId))
      }
    }
    const question = await this.questionsRepository.findById(questionId)
    if (question) {
      await this.cacheSet(this.questionKey(question.id), CachedQuestionsMapper.toPersistence(question))
      await this.cacheSet(this.questionTitleKey(question.title), CachedQuestionsMapper.toPersistence(question))
      await this.cacheSet(this.questionSlugKey(question.slug), CachedQuestionsMapper.toPersistence(question))
    }
    return question
  }

  async findByTitle (questionTitle: string): Promise<Question | null> {
    const cached = await this.cacheGet(this.questionTitleKey(questionTitle))
    if (cached) {
      try {
        return CachedQuestionsMapper.toDomain(cached)
      } catch {
        await this.cacheDelete(this.questionTitleKey(questionTitle))
      }
    }
    const question = await this.questionsRepository.findByTitle(questionTitle)
    if (question) {
      await this.cacheSet(this.questionKey(question.id), CachedQuestionsMapper.toPersistence(question))
      await this.cacheSet(this.questionTitleKey(question.title), CachedQuestionsMapper.toPersistence(question))
      await this.cacheSet(this.questionSlugKey(question.slug), CachedQuestionsMapper.toPersistence(question))
    }
    return question
  }

  async findBySlug (params: FindQuestionBySlugParams): Promise<FindQuestionsResult | null> {
    const key = this.questionsListKey({ slug: params.slug, ...params })
    const cached = await this.cacheGet(key)
    if (cached) {
      try {
        return CachedQuestionsMapper.toFindBySlugDomain(cached)
      } catch {
        await this.cacheDelete(key)
      }
    }

    const result = await this.questionsRepository.findBySlug(params)
    if (result) {
      await this.cacheSet(key, CachedQuestionsMapper.toFindBySlugPersistence(result))
    }
    return result
  }

  async findMany (params: PaginationParams): Promise<PaginatedQuestions> {
    const key = this.questionsListKey(params)
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

  private titleKey (title: string) {
    return `questions:title:${title}`
  }

  private slugKey (slug: string) {
    return `questions:slug:${slug}`
  }
}
