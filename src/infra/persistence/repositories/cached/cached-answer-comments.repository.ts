import type { PaginationParams } from '@/core/application/pagination-params'
import type {
  AnswerCommentsRepository,
  PaginatedAnswerComments
} from '@/application/repositories/answer-comments.repository'
import type { UpdateCommentData } from '@/application/repositories/comments.repository'
import { CachedAnswerCommentMapper } from '@/infra/persistence/mappers/cached/cached-answer-comment.mapper'
import type { RedisService } from '@/infra/providers/cache/redis-service'
import type { AnswerComment } from '@/domain/entities/answer-comment/answer-comment.entity'

export class CachedAnswerCommentsRepository implements AnswerCommentsRepository {
  private readonly keyPrefix = 'answer-comments'

  constructor (
    private readonly redis: RedisService,
    private readonly answerCommentsRepository: AnswerCommentsRepository
  ) {
  }

  async save (comment: AnswerComment): Promise<void> {
    await this.answerCommentsRepository.save(comment)
    await this.redis.set(this.commentKey(comment.id), CachedAnswerCommentMapper.toPersistence(comment))
  }

  async update (commentData: UpdateCommentData): Promise<AnswerComment> {
    const updated = await this.answerCommentsRepository.update(commentData)
    await this.redis.set(this.commentKey(updated.id), CachedAnswerCommentMapper.toPersistence(updated))
    return updated
  }

  async delete (commentId: string): Promise<void> {
    const comment = await this.answerCommentsRepository.findById(commentId)
    if (!comment) return
    await this.answerCommentsRepository.delete(commentId)
    await this.redis.delete(this.commentKey(comment.id))
  }

  async findById (commentId: string): Promise<AnswerComment | null> {
    const cached = await this.redis.getWithFallback(this.commentKey(commentId), CachedAnswerCommentMapper.toDomain)
    if (cached) return cached
    const comment = await this.answerCommentsRepository.findById(commentId)
    if (comment) {
      await this.redis.set(this.commentKey(comment.id), CachedAnswerCommentMapper.toPersistence(comment))
    }
    return comment
  }

  async findManyByAnswerId (answerId: string, params: PaginationParams): Promise<PaginatedAnswerComments> {
    const key = this.redis.listKey(this.keyPrefix, { answerId, ...params })
    const cached = await this.redis.getWithFallback(key, CachedAnswerCommentMapper.toPaginatedDomain)
    if (cached) return cached
    const comments = await this.answerCommentsRepository.findManyByAnswerId(answerId, params)
    await this.redis.set(key, CachedAnswerCommentMapper.toPaginatedPersistence(comments))
    return comments
  }

  private commentKey (id: string): string {
    return this.redis.entityKey(this.keyPrefix, id)
  }
}
