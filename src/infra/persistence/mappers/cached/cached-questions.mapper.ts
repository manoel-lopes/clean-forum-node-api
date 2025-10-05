import type { PaginatedItems } from '@/core/application/paginated-items'
import type { FindQuestionsResult, PaginatedQuestions } from '@/application/repositories/questions.repository'
import { BaseCachedMapper } from '@/infra/persistence/mappers/cached/base/base-cached-mapper'
import type { Answer } from '@/domain/entities/answer/answer.entity'
import { Question } from '@/domain/entities/question/question.entity'

type CachedQuestion = Omit<Question, 'createdAt' | 'updatedAt' | 'answers'> & {
  createdAt: string
  updatedAt?: string
}

export class CachedQuestionsMapper extends BaseCachedMapper {
  static toDomain (cache: string): Question | null {
    const item = JSON.parse(cache)
    if (this.isValid(item)) {
      const question = Question.create({
        authorId: item.authorId,
        title: item.title,
        content: item.content,
        bestAnswerId: item.bestAnswerId,
        createdAt: new Date(item.createdAt),
      }, item.id)
      if (item.updatedAt) {
        Object.assign(question, {
          updatedAt: new Date(item.updatedAt)
        })
      }
      return question
    }
    return null
  }

  static toPaginatedDomain (cache: string): PaginatedQuestions {
    return super.toPaginated(cache, (cache: string) => this.toDomainArray(cache))
  }

  static toFindBySlugDomain (cache: string): FindQuestionsResult | null {
    const item = JSON.parse(cache)
    if (!item || typeof item !== 'object') return null
    const cachedResult = item as { question?: unknown; answers?: PaginatedItems<Answer> }
    const question = this.toDomain(JSON.stringify(cachedResult.question))
    if (!question) return null
    return {
      ...question,
      answers: cachedResult.answers || {
        page: 1,
        pageSize: 0,
        totalItems: 0,
        totalPages: 0,
        items: [],
        order: 'desc'
      }
    }
  }

  static toFindBySlugPersistence (result: FindQuestionsResult): string {
    if (!result) return JSON.stringify(null)
    const { answers, ...questionPart } = result
    return JSON.stringify({
      question: this.toPersistence(questionPart as Question),
      answers
    })
  }

  private static toDomainArray (cache: string): Question[] {
    const item = JSON.parse(cache)
    const items = Array.isArray(item) ? item : [item]
    return items
      .map(item => this.toDomain(JSON.stringify(item)))
      .filter((item): item is Question => item !== null)
  }

  private static isValid (parsedCache: unknown): parsedCache is CachedQuestion {
    return typeof parsedCache === 'object' &&
      parsedCache !== null &&
      'id' in parsedCache &&
      typeof parsedCache.id === 'string' &&
      'authorId' in parsedCache &&
      typeof parsedCache.authorId === 'string' &&
      'title' in parsedCache &&
      typeof parsedCache.title === 'string' &&
      'content' in parsedCache &&
      typeof parsedCache.content === 'string' &&
      'slug' in parsedCache &&
      typeof parsedCache.slug === 'string' &&
      'createdAt' in parsedCache &&
      typeof parsedCache.createdAt === 'string' &&
      (!('updatedAt' in parsedCache) || typeof parsedCache.updatedAt === 'string') &&
      (!('bestAnswerId' in parsedCache) || parsedCache.bestAnswerId === null || typeof parsedCache.bestAnswerId === 'string')
  }
}
