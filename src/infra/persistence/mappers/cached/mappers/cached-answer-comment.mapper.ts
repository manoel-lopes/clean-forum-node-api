import { AnswerComment } from '@/domain/entities/answer-comment/answer-comment.entity'

type ParsedCacheAnswerComment = {
  content: string
  authorId: string
  answerId: string
  createdAt: string
  updatedAt: string
}

export class CachedAnswerCommentMapper {
  static toPersistence (comment: AnswerComment | AnswerComment[]): string {
    return JSON.stringify(comment)
  }

  static toDomain (cache: string): AnswerComment[] {
    const parsed = JSON.parse(cache)
    const items = Array.isArray(parsed) ? parsed : [parsed]
    return items
      .map(item => {
        if (this.isValid(item)) {
          const { content, authorId, answerId, createdAt, updatedAt } = item
          return AnswerComment.create({
            content,
            authorId,
            answerId,
            createdAt: new Date(createdAt),
            updatedAt: new Date(updatedAt),
          })
        }
        return null
      })
      .filter((c): c is AnswerComment => c !== null)
  }

  // Converts JSON string representing array of IDs to string[]
  static toIdArray (cache: string): string[] {
    const parsed = JSON.parse(cache)
    if (Array.isArray(parsed) && parsed.every(id => typeof id === 'string')) {
      return parsed
    }
    return []
  }

  // Optional: array to JSON string
  static toPersistenceArray (comments: AnswerComment[]): string {
    return JSON.stringify(comments)
  }

  private static isValid (parsedCache: unknown): parsedCache is ParsedCacheAnswerComment {
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
