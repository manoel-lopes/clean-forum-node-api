import { BaseCachedMapper } from '@/infra/persistence/mappers/cached/base/base-cached-mapper'
import type { Answer as AnswerType } from '@/domain/enterprise/entities/answer.entity'

type CachedAnswer = Omit<AnswerType, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt?: string
}

export class CachedAnswersMapper extends BaseCachedMapper {
  static toDomain (cache: string): AnswerType | null {
    const item = JSON.parse(cache)
    if (this.isValid(item)) {
      const answer: AnswerType = {
        id: item.id,
        content: item.content,
        questionId: item.questionId,
        authorId: item.authorId,
        excerpt: item.content.substring(0, 45).replace(/ $/, '').concat('...'),
        createdAt: new Date(item.createdAt),
        updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(item.createdAt),
      }
      return answer
    }
    return null
  }

  private static isValid (parsedCache: unknown): parsedCache is CachedAnswer {
    return typeof parsedCache === 'object' &&
      parsedCache !== null &&
      'id' in parsedCache &&
      typeof parsedCache.id === 'string' &&
      'content' in parsedCache &&
      typeof parsedCache.content === 'string' &&
      'questionId' in parsedCache &&
      typeof parsedCache.questionId === 'string' &&
      'authorId' in parsedCache &&
      typeof parsedCache.authorId === 'string' &&
      'createdAt' in parsedCache &&
      typeof parsedCache.createdAt === 'string' &&
      (!('updatedAt' in parsedCache) || typeof parsedCache.updatedAt === 'string')
  }
}
