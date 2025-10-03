import type { PaginatedItems } from '@/core/application/paginated-items'
import { BaseCachedMapper } from '@/infra/persistence/mappers/cached/base/base-cached-mapper'
import { Answer } from '@/domain/models/answer/answer.model'

type CachedAnswer = Omit<Answer, 'createdAt' | 'updatedAt' | 'excerpt'> & {
  createdAt: string
  updatedAt?: string
}

export class CachedAnswersMapper extends BaseCachedMapper {
  static toDomain (cache: string): Answer | null {
    const item = JSON.parse(cache)
    if (this.isValid(item)) {
      const answer = new Answer(item.content, item.questionId, item.authorId, item.id)
      Object.assign(answer, {
        createdAt: new Date(item.createdAt),
        updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined
      })
      return answer
    }
    return null
  }

  static toPaginatedDomain (cache: string): PaginatedItems<Answer> {
    return super.toPaginated(cache, this.toDomainArray)
  }

  private static toDomainArray (cache: string): Answer[] {
    const item = JSON.parse(cache)
    const items = Array.isArray(item) ? item : [item]
    return items
      .map(item => this.toDomain(JSON.stringify(item)))
      .filter((item): item is Answer => item !== null)
  }

  private static isValid (parsedCache: unknown): parsedCache is CachedAnswer {
    return typeof parsedCache === 'object' &&
      parsedCache !== null &&
      'content' in parsedCache &&
      typeof parsedCache.content === 'string' &&
      'questionId' in parsedCache &&
      typeof parsedCache.questionId === 'string' &&
      'authorId' in parsedCache &&
      typeof parsedCache.authorId === 'string' &&
      'createdAt' in parsedCache &&
      typeof parsedCache.createdAt === 'string'
  }
}
