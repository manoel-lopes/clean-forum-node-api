import type { PaginatedAnswerComments } from '@/domain/application/repositories/answer-comments.repository'
import type { AnswerComment } from '@/domain/enterprise/entities/answer-comment.entity'
import { BaseCachedMapper } from './base/base-cached-mapper'

type CachedAnswerComment = Omit<Required<AnswerComment>, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}

export class CachedAnswerCommentMapper extends BaseCachedMapper {
  static toDomain (cache: string): AnswerComment | null {
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

  static toPaginatedDomain (cache: string): PaginatedAnswerComments {
    return super.toPaginated(cache, this.toDomainArray)
  }

  private static toDomainArray (cache: string): AnswerComment[] {
    const item = JSON.parse(cache)
    const items = Array.isArray(item) ? item : [item]
    return items
      .map(item => this.toDomain(JSON.stringify(item)))
      .filter((item): item is AnswerComment => item !== null)
  }

  private static isValid (parsedCache: unknown): parsedCache is CachedAnswerComment {
    return typeof parsedCache === 'object' &&
      parsedCache !== null &&
      'content' in parsedCache &&
      typeof parsedCache.content === 'string' &&
      'authorId' in parsedCache &&
      typeof parsedCache.authorId === 'string' &&
      'answerId' in parsedCache &&
      typeof parsedCache.answerId === 'string' &&
      'createdAt' in parsedCache &&
      typeof parsedCache.createdAt === 'string' &&
      'updatedAt' in parsedCache &&
      typeof parsedCache.updatedAt === 'string'
  }
}
