import type { PaginatedQuestionComments } from '@/domain/application/repositories/question-comments.repository'
import { BaseCachedMapper } from '@/infra/persistence/mappers/cached/base/base-cached-mapper'
import type { QuestionComment } from '@/domain/enterprise/entities/question-comment.entity'

type CachedQuestionComment = Omit<QuestionComment, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt: string
}

export class CachedQuestionCommentMapper extends BaseCachedMapper {
  static toDomain (cache: string): QuestionComment | null {
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

  static toPaginatedDomain (cache: string): PaginatedQuestionComments {
    return super.toPaginated(cache, this.toDomainArray)
  }

  private static toDomainArray (cache: string): QuestionComment[] {
    const item = JSON.parse(cache)
    const items = Array.isArray(item) ? item : [item]
    return items
      .map(item => this.toDomain(JSON.stringify(item)))
      .filter((item): item is QuestionComment => item !== null)
  }

  private static isValid (parsedCache: unknown): parsedCache is CachedQuestionComment {
    return typeof parsedCache === 'object' &&
      parsedCache !== null &&
      'authorId' in parsedCache &&
      typeof parsedCache.authorId === 'string' &&
      'content' in parsedCache &&
      typeof parsedCache.content === 'string' &&
      'questionId' in parsedCache &&
      typeof parsedCache.questionId === 'string' &&
      'createdAt' in parsedCache &&
      typeof parsedCache.createdAt === 'string' &&
      'updatedAt' in parsedCache &&
      typeof parsedCache.updatedAt === 'string'
  }
}
