import type { PaginationParams } from '@/core/domain/application/pagination-params'
import type { UpdateCommentData } from '@/domain/application/repositories/base/comments.repository'
import type {
  PaginatedQuestionComments,
  QuestionCommentsRepository,
} from '@/domain/application/repositories/question-comments.repository'
import { CachedQuestionCommentMapper } from '@/infra/persistence/mappers/cached/cached-question-comment.mapper'
import type { RedisService } from '@/infra/providers/cache/redis-service'
import type { QuestionComment } from '@/domain/enterprise/entities/question-comment.entity'

export class CachedQuestionCommentsRepository implements QuestionCommentsRepository {
  private readonly keyPrefix = 'question-comments'

  constructor (
    private readonly redis: RedisService,
    private readonly questionCommentsRepo: QuestionCommentsRepository
  ) {}

  async create (comment: QuestionComment): Promise<QuestionComment> {
    const createdComment = await this.questionCommentsRepo.create(comment)
    await this.redis.set(this.commentKey(createdComment.id), CachedQuestionCommentMapper.toPersistence(createdComment))
    await this.invalidateListCaches(createdComment.questionId)
    return createdComment
  }

  async update (commentData: UpdateCommentData): Promise<QuestionComment> {
    const updated = await this.questionCommentsRepo.update(commentData)
    await this.redis.set(this.commentKey(updated.id), CachedQuestionCommentMapper.toPersistence(updated))
    await this.invalidateListCaches(updated.questionId)
    return updated
  }

  async delete (commentId: string) {
    const comment = await this.questionCommentsRepo.findById(commentId)
    if (!comment) return
    await this.questionCommentsRepo.delete(commentId)
    await this.redis.delete(this.commentKey(comment.id))
    await this.invalidateListCaches(comment.questionId)
  }

  async findById (commentId: string): Promise<QuestionComment | null> {
    const cached = await this.redis.get(this.commentKey(commentId), CachedQuestionCommentMapper.toDomain)
    if (cached) return cached
    const comment = await this.questionCommentsRepo.findById(commentId)
    if (comment) {
      await this.redis.set(this.commentKey(comment.id), CachedQuestionCommentMapper.toPersistence(comment))
    }
    return comment
  }

  async findManyByQuestionId (questionId: string, params: PaginationParams): Promise<PaginatedQuestionComments> {
    const key = this.redis.listKey(this.keyPrefix, { questionId, ...params })
    const cached = await this.redis.get(key, CachedQuestionCommentMapper.toPaginatedDomain)
    if (cached) return cached
    const comments = await this.questionCommentsRepo.findManyByQuestionId(questionId, params)
    await this.redis.set(key, CachedQuestionCommentMapper.toPaginatedPersistence(comments))
    return comments
  }

  private commentKey (id: string): string {
    return this.redis.entityKey(this.keyPrefix, id)
  }

  private async invalidateListCaches (questionId: string) {
    await this.redis.deletePattern(`${this.keyPrefix}:list:*questionId*${questionId}*`)
  }
}
