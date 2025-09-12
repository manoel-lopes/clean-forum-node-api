import type { PaginationParams } from '@/core/application/pagination-params'
import type { UpdateCommentData } from '@/application/repositories/comments.repository'
import type {
  PaginatedQuestionComments,
  QuestionCommentsRepository
} from '@/application/repositories/question-comments.repository'
import { CachedQuestionCommentMapper } from '@/infra/persistence/mappers/cached/cached-question-comment.mapper'
import type { RedisService } from '@/infra/providers/cache/redis-service'
import type { QuestionComment } from '@/domain/entities/question-comment/question-comment.entity'

export class CachedQuestionCommentsRepository implements QuestionCommentsRepository {
  private readonly keyPrefix = 'question-comments'

  constructor (
    private readonly redis: RedisService,
    private readonly questionCommentsRepository: QuestionCommentsRepository
  ) {}

  async save (comment: QuestionComment): Promise<void> {
    await this.questionCommentsRepository.save(comment)
    await this.redis.set(this.commentKey(comment.id), CachedQuestionCommentMapper.toPersistence(comment))
  }

  async update (commentData: UpdateCommentData): Promise<QuestionComment> {
    const updated = await this.questionCommentsRepository.update(commentData)
    await this.redis.set(this.commentKey(updated.id), CachedQuestionCommentMapper.toPersistence(updated))
    return updated
  }

  async delete (commentId: string): Promise<void> {
    const comment = await this.questionCommentsRepository.findById(commentId)
    if (!comment) return
    await this.questionCommentsRepository.delete(commentId)
    await this.redis.delete(this.commentKey(comment.id))
  }

  async findById (commentId: string): Promise<QuestionComment | null> {
    const cached = await this.redis.getWithFallback(this.commentKey(commentId), CachedQuestionCommentMapper.toDomain)
    if (cached) return cached

    const comment = await this.questionCommentsRepository.findById(commentId)
    if (comment) {
      await this.redis.set(this.commentKey(comment.id), CachedQuestionCommentMapper.toPersistence(comment))
    }
    return comment
  }

  async findManyByQuestionId (questionId: string, params: PaginationParams): Promise<PaginatedQuestionComments> {
    const key = this.redis.listKey(this.keyPrefix, { questionId, ...params })
    const cached = await this.redis.getWithFallback(key, CachedQuestionCommentMapper.toPaginatedDomain)
    if (cached) return cached
    const comments = await this.questionCommentsRepository.findManyByQuestionId(questionId, params)
    await this.redis.setShort(key, CachedQuestionCommentMapper.toPaginatedPersistence(comments))
    return comments
  }

  private commentKey (id: string): string {
    return this.redis.entityKey(this.keyPrefix, id)
  }
}
