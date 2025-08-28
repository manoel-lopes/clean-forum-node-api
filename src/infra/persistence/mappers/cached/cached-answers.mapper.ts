import { BaseCachedMapper } from '@/infra/persistence/mappers/cached/base/base-cached-mapper'
import { Answer } from '@/domain/entities/answer/answer.entity'

type CachedAnswer = Omit<Answer, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}

export class CachedAnswersMapper extends BaseCachedMapper {
  static toDomain (cache: string): Answer | null {
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

  private static isValid (parsedCache: unknown): parsedCache is CachedAnswer {
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
