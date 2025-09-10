import type { PaginationParams } from '@/core/application/pagination-params'
import type { UpdateCommentData } from '@/application/repositories/comments.repository'
import type {
  PaginatedQuestionComments,
  QuestionCommentsRepository
} from '@/application/repositories/question-comments.repository'
import { CachedQuestionCommentMapper } from '@/infra/persistence/mappers/cached/cached-question-comment.mapper'
import type { RedisService } from '@/infra/providers/cache/redis-service'
import type { QuestionComment } from '@/domain/entities/question-comment/question-comment.entity'
import { BaseCachedRepository } from './base/base-cached.repository'

export class CachedQuestionCommentsRepository extends BaseCachedRepository implements QuestionCommentsRepository {
  private readonly keyPrefix = 'question-comments'

  constructor (
    redis: RedisService,
    private readonly questionCommentsRepository: QuestionCommentsRepository
  ) {
    super(redis)
  }

  private commentKey (id: string): string {
    return this.entityKey(this.keyPrefix, id)
  }

  private commentsListKey (params: Record<string, unknown>): string {
    return this.listKey(this.keyPrefix, params)
  }

  async save (comment: QuestionComment): Promise<void> {
    await this.questionCommentsRepository.save(comment)
    await this.cacheSet(this.commentKey(comment.id), CachedQuestionCommentMapper.toPersistence(comment))
  }

  async update (commentData: UpdateCommentData): Promise<QuestionComment> {
    const updated = await this.questionCommentsRepository.update(commentData)
    await this.cacheSet(this.commentKey(updated.id), CachedQuestionCommentMapper.toPersistence(updated))
    return updated
  }

  async delete (commentId: string): Promise<void> {
    const comment = await this.questionCommentsRepository.findById(commentId)
    if (!comment) return
    await this.questionCommentsRepository.delete(commentId)
    await this.cacheDelete(this.commentKey(comment.id))
  }

  async findById (commentId: string): Promise<QuestionComment | null> {
    const key = this.commentKey(commentId)
    const cached = await this.cacheGet(key)
    if (cached) {
      try {
        return CachedQuestionCommentMapper.toDomain(cached)
      } catch {
        await this.cacheDelete(key)
      }
    }
    const comment = await this.questionCommentsRepository.findById(commentId)
    if (comment) {
      await this.cacheSet(key, CachedQuestionCommentMapper.toPersistence(comment))
    }
    return comment
  }

  async findManyByQuestionId (questionId: string, params: PaginationParams): Promise<PaginatedQuestionComments> {
    const { page = 1, pageSize = 10, order = 'desc' } = params
    const key = this.commentsListKey({ questionId, page, pageSize, order })
    const cached = await this.cacheGet(key)
    if (cached) {
      try {
        return CachedQuestionCommentMapper.toPaginatedDomain(cached)
      } catch {
        await this.cacheDelete(key)
      }
    }
    const comments = await this.questionCommentsRepository.findManyByQuestionId(questionId, params)
    await this.cacheSet(key, CachedQuestionCommentMapper.toPaginatedPersistence(comments))
    return comments
  }
}
