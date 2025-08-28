import type { PaginatedQuestions } from '@/application/repositories/questions.repository'
import { BaseCachedMapper } from '@/infra/persistence/mappers/cached/base/base-cached-mapper'
import { Question } from '@/domain/entities/question/question.entity'

type CachedQuestion = Omit<Question, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}

export class CachedQuestionsMapper extends BaseCachedMapper {
  static toDomain (cache: string): Question | null {
    const item = JSON.parse(cache)
    if (this.isValid(item)) {
      return {
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt)
      }
    }
    return null
  }

  static toPaginatedDomain (cache: string): PaginatedQuestions {
    return super.toPaginated(cache, this.toDomainArray)
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
      'authorId' in parsedCache &&
      typeof parsedCache.authorId === 'string' &&
      'title' in parsedCache &&
      typeof parsedCache.title === 'string' &&
      'content' in parsedCache &&
      typeof parsedCache.content === 'string' &&
      'bestAnswerId' in parsedCache &&
      (parsedCache.bestAnswerId === null || typeof parsedCache.bestAnswerId === 'string') &&
      'createdAt' in parsedCache &&
      typeof parsedCache.createdAt === 'string' &&
      'updatedAt' in parsedCache &&
      typeof parsedCache.updatedAt === 'string'
  }
}
