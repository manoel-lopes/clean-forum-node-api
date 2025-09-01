import type { PaginationParams } from '@/core/application/pagination-params'
import type { UpdateCommentData } from '@/application/repositories/comments.repository'
import type {
  PaginatedQuestionComments,
  QuestionCommentsRepository
} from '@/application/repositories/question-comments.repository'
import { CachedQuestionCommentMapper } from '@/infra/persistence/mappers/cached/cached-question-comment.mapper'
import type { RedisService } from '@/infra/providers/cache/redis-service'
import type { QuestionComment } from '@/domain/entities/question-comment/question-comment.entity'

type PaginatedKeysParams = {
  questionId: string
  page: number
  pageSize: number
  order: string
}

export class CachedQuestionCommentsRepository implements QuestionCommentsRepository {
  constructor (
    private readonly redis: RedisService,
    private readonly questionCommentsRepository: QuestionCommentsRepository
  ) {}

  private async invalidatePaginatedKeys (questionId: string) {
    const setKey = this.paginatedKeysSet(questionId)
    const keys = await this.redis.smembers(setKey)
    if (keys.length) {
      await this.redis.delete(...keys)
      await this.redis.delete(setKey)
    }
  }

  async save (comment: QuestionComment): Promise<void> {
    await this.questionCommentsRepository.save(comment)
    await this.redis.set(this.entityKey(comment.id), CachedQuestionCommentMapper.toPersistence(comment))
    await this.invalidatePaginatedKeys(comment.questionId)
  }

  async update (commentData: UpdateCommentData): Promise<QuestionComment> {
    const updated = await this.questionCommentsRepository.update(commentData)
    await this.redis.set(this.entityKey(updated.id), CachedQuestionCommentMapper.toPersistence(updated))
    await this.invalidatePaginatedKeys(updated.questionId)
    return updated
  }

  async delete (commentId: string): Promise<void> {
    const comment = await this.questionCommentsRepository.findById(commentId)
    if (!comment) return
    await this.questionCommentsRepository.delete(commentId)
    await this.redis.delete(this.entityKey(comment.id))
    await this.invalidatePaginatedKeys(comment.questionId)
  }

  async findById (commentId: string): Promise<QuestionComment | null> {
    const cached = await this.redis.get(this.entityKey(commentId))
    if (cached) {
      return CachedQuestionCommentMapper.toDomain(cached)
    }
    const comment = await this.questionCommentsRepository.findById(commentId)
    if (comment) {
      await this.redis.set(this.entityKey(comment.id),
        CachedQuestionCommentMapper.toPersistence(comment)
      )
    }
    return comment
  }

  async findManyByQuestionId (questionId: string, params: PaginationParams): Promise<PaginatedQuestionComments> {
    const { page = 1, pageSize = 10, order = 'desc' } = params
    const key = this.listKeyByQuestionId({ questionId, page, pageSize, order })
    const cached = await this.redis.get(key)
    if (cached) {
      return CachedQuestionCommentMapper.toPaginatedDomain(cached)
    }
    const comments = await this.questionCommentsRepository.findManyByQuestionId(questionId, params)
    await this.redis.set(key, CachedQuestionCommentMapper.toPaginatedPersistence(comments))
    await this.redis.sadd(this.paginatedKeysSet(questionId), key)
    return comments
  }

  private entityKey (id: string) {
    return `question-comments:${id}`
  }

  private listKeyByQuestionId (params: PaginatedKeysParams) {
    const { questionId, page, pageSize, order } = params
    return `question-comments:questionId:${questionId}:page:${page}:size:${pageSize}:order:${order}`
  }

  private paginatedKeysSet (questionId: string) {
    return `question-comments:questionId:${questionId}:keys`
  }
}
