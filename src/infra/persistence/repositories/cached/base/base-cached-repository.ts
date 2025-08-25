import { CachedAnswerCommentMapper } from '@/infra/persistence/mappers/cached/mappers/cached-answer-comment.mapper'
import type { RedisService } from '@/infra/providers/cache/redis-service'

export abstract class BaseCachedRepository {
  protected readonly cacheService: RedisService
  protected readonly cachedAnswerCommentMapper: CachedAnswerCommentMapper

  protected async getCachedOrFetch<T> (
    cacheKey: string,
    fetchFunction: () => Promise<T>,
    mapToDomainFunction: (cachedData: string) => Promise<T | null>,
    mapToPersistenceFunction: (data: T) => string
  ): Promise<T> {
    const cachedData = await this.cacheService.get(cacheKey)
    if (cachedData) {
      const domainData = await mapToDomainFunction(cachedData)
      if (domainData) {
        return domainData
      }
    }

    const data = await fetchFunction()
    await this.cacheService.set(cacheKey, mapToPersistenceFunction(data))
    return data
  }
}
