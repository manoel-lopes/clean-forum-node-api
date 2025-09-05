import { BaseCachedMapper } from '@/infra/persistence/mappers/cached/base/base-cached-mapper'
import { Answer } from '@/domain/entities/answer/answer.entity'

type CachedAnswer = Omit<Answer, 'createdAt' | 'updatedAt'> & {
  createdAt: string
  updatedAt?: string
}

export class CachedAnswersMapper extends BaseCachedMapper {
  static toDomain (cache: string): Answer | null {
    const item = JSON.parse(cache)
    if (this.isValid(item)) {
      const answer = Answer.create({
        content: item.content,
        questionId: item.questionId,
        authorId: item.authorId
      }, item.id)

      // Set the dates from cache
      Object.assign(answer, {
        createdAt: new Date(item.createdAt),
        updatedAt: item.updatedAt ? new Date(item.updatedAt) : undefined
      })

      return answer
    }
    return null
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
