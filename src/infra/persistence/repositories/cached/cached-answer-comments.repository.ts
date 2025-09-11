import type { PaginationParams } from '@/core/application/pagination-params'
import type {
  AnswerCommentsRepository,
  PaginatedAnswerComments
} from '@/application/repositories/answer-comments.repository'
import type { UpdateCommentData } from '@/application/repositories/comments.repository'
import { CachedAnswerCommentMapper } from '@/infra/persistence/mappers/cached/cached-answer-comment.mapper'
import type { RedisService } from '@/infra/providers/cache/redis-service'
import type { AnswerComment } from '@/domain/entities/answer-comment/answer-comment.entity'
import { BaseCachedRepository } from './base/base-cached.repository'

export class CachedAnswerCommentsRepository extends BaseCachedRepository implements AnswerCommentsRepository {
  private readonly keyPrefix = 'answer-comments'

  constructor (
    redis: RedisService,
    private readonly answerCommentsRepository: AnswerCommentsRepository
  ) {
    super(redis)
  }

  private commentKey (id: string): string {
    return this.entityKey(this.keyPrefix, id)
  }

  private commentsListKey (params: Record<string, unknown>): string {
    return this.listKey(this.keyPrefix, params)
  }

  async save (comment: AnswerComment): Promise<void> {
    await this.answerCommentsRepository.save(comment)
    await this.cacheSet(this.commentKey(comment.id), CachedAnswerCommentMapper.toPersistence(comment))
  }

  async update (commentData: UpdateCommentData): Promise<AnswerComment> {
    const updated = await this.answerCommentsRepository.update(commentData)
    await this.cacheSet(this.commentKey(updated.id), CachedAnswerCommentMapper.toPersistence(updated))
    return updated
  }

  async delete (commentId: string): Promise<void> {
    const comment = await this.answerCommentsRepository.findById(commentId)
    if (!comment) return
    await this.answerCommentsRepository.delete(commentId)
    await this.cacheDelete(this.commentKey(comment.id))
  }

  async findById (commentId: string): Promise<AnswerComment | null> {
    const cached = await this.cacheGet(this.commentKey(commentId))
    if (cached) {
      try {
        return CachedAnswerCommentMapper.toDomain(cached)
      } catch {
        await this.cacheDelete(this.commentKey(commentId))
      }
    }
    const comment = await this.answerCommentsRepository.findById(commentId)
    if (comment) {
      await this.cacheSet(this.commentKey(comment.id), CachedAnswerCommentMapper.toPersistence(comment))
    }
    return comment
  }

  async findManyByAnswerId (answerId: string, params: PaginationParams): Promise<PaginatedAnswerComments> {
    const key = this.commentsListKey({ answerId, ...params })
    const cached = await this.cacheGet(key)
    if (cached) {
      try {
        return CachedAnswerCommentMapper.toPaginatedDomain(cached)
      } catch {
        await this.cacheDelete(key)
      }
    }
    const comments = await this.answerCommentsRepository.findManyByAnswerId(answerId, params)
    await this.cacheSet(key, CachedAnswerCommentMapper.toPaginatedPersistence(comments))
    return comments
  }
}
