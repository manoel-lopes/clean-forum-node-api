import type { PaginationParams } from '@/core/domain/application/pagination-params'
import type {
  AnswerAttachmentsRepository,
  PaginatedAnswerAttachments,
} from '@/domain/application/repositories/answer-attachments.repository'
import { CachedAnswerAttachmentsMapper } from '@/infra/persistence/mappers/cached/cached-answer-attachments.mapper'
import type { RedisService } from '@/infra/providers/cache/redis-service'
import type { AnswerAttachment, AnswerAttachmentProps } from '@/domain/enterprise/entities/answer-attachment.entity'

export class CachedAnswerAttachmentsRepository implements AnswerAttachmentsRepository {
  private readonly keyPrefix = 'answer-attachments'

  constructor (
    private readonly redis: RedisService,
    private readonly answerAttachmentsRepository: AnswerAttachmentsRepository
  ) {}

  async create (attachment: AnswerAttachmentProps): Promise<AnswerAttachment> {
    const created = await this.answerAttachmentsRepository.create(attachment)
    await this.redis.set(this.attachmentKey(created.id), CachedAnswerAttachmentsMapper.toCache(created))
    await this.invalidateListCache(created.answerId)
    return created
  }

  async createMany (attachments: AnswerAttachmentProps[]): Promise<AnswerAttachment[]> {
    const created = await this.answerAttachmentsRepository.createMany(attachments)
    await Promise.all(
      created.map(async (attachment) => {
        await this.redis.set(this.attachmentKey(attachment.id), CachedAnswerAttachmentsMapper.toCache(attachment))
      })
    )
    if (attachments.length > 0 && attachments[0].answerId) {
      await this.invalidateListCache(attachments[0].answerId)
    }
    return created
  }

  async findById (attachmentId: string): Promise<AnswerAttachment | null> {
    const cached = await this.redis.get(this.attachmentKey(attachmentId), CachedAnswerAttachmentsMapper.fromCacheString)
    if (cached) return cached
    const attachment = await this.answerAttachmentsRepository.findById(attachmentId)
    if (attachment) {
      await this.redis.set(this.attachmentKey(attachment.id), CachedAnswerAttachmentsMapper.toCache(attachment))
    }
    return attachment
  }

  async findManyByAnswerId (answerId: string, params: PaginationParams): Promise<PaginatedAnswerAttachments> {
    const key = this.redis.listKey(this.keyPrefix, { answerId, ...params })
    const cached = await this.redis.get(key, CachedAnswerAttachmentsMapper.fromPaginatedCacheString)
    if (cached) return cached
    const attachments = await this.answerAttachmentsRepository.findManyByAnswerId(answerId, params)
    await this.redis.set(key, CachedAnswerAttachmentsMapper.toPaginatedCache(attachments))
    return attachments
  }

  async update (
    attachmentId: string,
    data: Partial<Pick<AnswerAttachment, 'title' | 'url'>>
  ): Promise<AnswerAttachment> {
    const attachment = await this.answerAttachmentsRepository.findById(attachmentId)
    const updated = await this.answerAttachmentsRepository.update(attachmentId, data)
    await this.redis.set(this.attachmentKey(updated.id), CachedAnswerAttachmentsMapper.toCache(updated))
    if (attachment) {
      await this.invalidateListCache(attachment.answerId)
    }
    return updated
  }

  async delete (attachmentId: string): Promise<void> {
    const attachment = await this.answerAttachmentsRepository.findById(attachmentId)
    await this.answerAttachmentsRepository.delete(attachmentId)
    await this.redis.delete(this.attachmentKey(attachmentId))
    if (attachment) {
      await this.invalidateListCache(attachment.answerId)
    }
  }

  async deleteMany (attachmentIds: string[]): Promise<void> {
    const attachments = await Promise.all(attachmentIds.map((id) => this.answerAttachmentsRepository.findById(id)))
    await this.answerAttachmentsRepository.deleteMany(attachmentIds)
    await Promise.all(attachmentIds.map((id) => this.redis.delete(this.attachmentKey(id))))
    const answerIds = [...new Set(attachments.filter((a) => a).map((a) => a!.answerId))]
    await Promise.all(answerIds.map((answerId) => this.invalidateListCache(answerId)))
  }

  private attachmentKey (id: string): string {
    return this.redis.entityKey(this.keyPrefix, id)
  }

  private async invalidateListCache (answerId: string): Promise<void> {
    const pattern = `${this.keyPrefix}:list:*answerId=${answerId}*`
    await this.redis.deletePattern(pattern)
  }
}
