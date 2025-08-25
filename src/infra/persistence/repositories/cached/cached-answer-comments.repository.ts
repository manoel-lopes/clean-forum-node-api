import type { PaginationParams } from '@/core/application/pagination-params'
import type { AnswerCommentsRepository, PaginatedAnswerComments } from '@/application/repositories/answer-comments.repository'
import type { UpdateCommentData } from '@/application/repositories/base/base-comments.repository'
import { CachedAnswerCommentMapper } from '@/infra/persistence/mappers/cached/mappers/cached-answer-comment.mapper'
import type { RedisService } from '@/infra/providers/cache/redis-service'
import type { AnswerComment } from '@/domain/entities/answer-comment/answer-comment.entity'

export class CachedAnswerCommentsRepository implements AnswerCommentsRepository {
  constructor (
    private readonly redisService: RedisService,
    private readonly answerCommentsRepository: AnswerCommentsRepository
  ) {}

  private entityKey (id: string) {
    return `answer-comments:${id}`
  }

  private listKeyByAnswerId (answerId: string, page: number, pageSize: number, order: string) {
    return `answer-comments:answerId:${answerId}:page:${page}:size:${pageSize}:order:${order}`
  }

  private paginatedKeysSet (answerId: string) {
    return `answer-comments:answerId:${answerId}:keys`
  }

  private async invalidatePaginatedKeys (answerId: string) {
    const setKey = this.paginatedKeysSet(answerId)
    const keys = await this.redisService.smembers(setKey)
    if (keys.length) {
      await this.redisService.delete(...keys)
      await this.redisService.delete(setKey)
    }
  }

  async save (comment: AnswerComment): Promise<void> {
    await this.answerCommentsRepository.save(comment)
    await this.redisService.set(this.entityKey(comment.id), CachedAnswerCommentMapper.toPersistence(comment))
    await this.invalidatePaginatedKeys(comment.answerId)
  }

  async update (commentData: UpdateCommentData): Promise<AnswerComment> {
    const updated = await this.answerCommentsRepository.update(commentData)
    await this.redisService.set(this.entityKey(updated.id), CachedAnswerCommentMapper.toPersistence(updated))
    await this.invalidatePaginatedKeys(updated.answerId)
    return updated
  }

  async delete (commentId: string): Promise<void> {
    const comment = await this.answerCommentsRepository.findById(commentId)
    if (!comment) return
    await this.answerCommentsRepository.delete(commentId)
    await this.redisService.delete(this.entityKey(comment.id))
    await this.invalidatePaginatedKeys(comment.answerId)
  }

  async findById (commentId: string): Promise<AnswerComment | null> {
    const cached = await this.redisService.get(this.entityKey(commentId))
    if (cached) {
      const comments = CachedAnswerCommentMapper.toDomain(cached)
      return comments[0] ?? null
    }
    const comment = await this.answerCommentsRepository.findById(commentId)
    if (comment) {
      await this.redisService.set(this.entityKey(comment.id),
        CachedAnswerCommentMapper.toPersistence(comment)
      )
    }
    return comment
  }

  async findManyByAnswerId (answerId: string, params: PaginationParams): Promise<PaginatedAnswerComments> {
    const { page = 1, pageSize = 10, order = 'desc' } = params
    const key = this.listKeyByAnswerId(answerId, page, pageSize, order)
    const cachedIds = await this.redisService.get(key)
    if (cachedIds) {
      const ids = CachedAnswerCommentMapper.toIdArray(cachedIds)
      const entityKeys = ids.map(id => this.entityKey(id))
      const cachedComments = await this.redisService.mget(entityKeys)
      const items = cachedComments
        .map(comment => {
          if (!comment) return null
          const comments = CachedAnswerCommentMapper.toDomain(comment)
          return comments[0] ?? null
        })
        .filter(Boolean)
      return {
        items,
        page,
        pageSize: Math.min(pageSize, items.length),
        totalItems: items.length,
        totalPages: Math.ceil(items.length / pageSize),
        order,
      }
    }
    const paginated = await this.answerCommentsRepository.findManyByAnswerId(answerId, params)
    const ids = paginated.items.map(comment => comment.id)
    await this.redisService.set(key, JSON.stringify(ids))
    await this.redisService.sadd(this.paginatedKeysSet(answerId), key)
    return paginated
  }
}
