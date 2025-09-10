import type { PaginationParams } from '@/core/application/pagination-params'
import type {
  AnswerCommentsRepository,
  PaginatedAnswerComments
} from '@/application/repositories/answer-comments.repository'
import type { UpdateCommentData } from '@/application/repositories/comments.repository'
import { CachedAnswerCommentMapper } from '@/infra/persistence/mappers/cached/cached-answer-comment.mapper'
import type { RedisService } from '@/infra/providers/cache/redis-service'
import type { AnswerComment } from '@/domain/entities/answer-comment/answer-comment.entity'

type PaginatedKeysParams = {
  answerId: string
  page: number
  pageSize: number
  order: string
}

export class CachedAnswerCommentsRepository implements AnswerCommentsRepository {
  constructor (
    private readonly redis: RedisService,
    private readonly answerCommentsRepository: AnswerCommentsRepository
  ) {}

  private async invalidatePaginatedKeys (answerId: string) {
    // Simple pattern-based invalidation - KISS principle
    const pattern = `answer-comments:answerId:${answerId}:*`
    const keys = await this.redis.keys(pattern)
    if (keys.length) {
      await this.redis.delete(...keys)
    }
  }

  async save (comment: AnswerComment): Promise<void> {
    await this.answerCommentsRepository.save(comment)
    await this.redis.set(this.entityKey(comment.id), CachedAnswerCommentMapper.toPersistence(comment))
    await this.invalidatePaginatedKeys(comment.answerId)
  }

  async update (commentData: UpdateCommentData): Promise<AnswerComment> {
    const updated = await this.answerCommentsRepository.update(commentData)
    await this.redis.set(this.entityKey(updated.id), CachedAnswerCommentMapper.toPersistence(updated))
    await this.invalidatePaginatedKeys(updated.answerId)
    return updated
  }

  async delete (commentId: string): Promise<void> {
    const comment = await this.answerCommentsRepository.findById(commentId)
    if (!comment) return
    await this.answerCommentsRepository.delete(commentId)
    await this.redis.delete(this.entityKey(comment.id))
    await this.invalidatePaginatedKeys(comment.answerId)
  }

  async findById (commentId: string): Promise<AnswerComment | null> {
    const cached = await this.redis.get(this.entityKey(commentId))
    if (cached) {
      try {
        return CachedAnswerCommentMapper.toDomain(cached)
      } catch {
        await this.redis.delete(this.entityKey(commentId))
      }
    }
    const comment = await this.answerCommentsRepository.findById(commentId)
    if (comment) {
      await this.redis.set(this.entityKey(comment.id),
        CachedAnswerCommentMapper.toPersistence(comment)
      )
    }
    return comment
  }

  async findManyByAnswerId (answerId: string, params: PaginationParams): Promise<PaginatedAnswerComments> {
    const { page = 1, pageSize = 10, order = 'desc' } = params
    const key = this.listKeyByAnswerId({ answerId, page, pageSize, order })
    const cached = await this.redis.get(key)
    if (cached) {
      try {
        return CachedAnswerCommentMapper.toPaginatedDomain(cached)
      } catch {
        await this.redis.delete(key)
      }
    }
    const comments = await this.answerCommentsRepository.findManyByAnswerId(answerId, params)
    await this.redis.set(key, CachedAnswerCommentMapper.toPaginatedPersistence(comments))
    // No need for complex set tracking - simple pattern matching handles invalidation
    return comments
  }

  private entityKey (id: string) {
    return `answer-comments:${id}`
  }

  private listKeyByAnswerId (params: PaginatedKeysParams) {
    const { answerId, page, pageSize, order } = params
    return `answer-comments:answerId:${answerId}:page:${page}:size:${pageSize}:order:${order}`
  }
}
