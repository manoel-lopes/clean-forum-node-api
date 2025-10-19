import type { PaginationParams } from '@/core/domain/application/pagination-params'
import type {
  PaginatedQuestionAttachments,
  QuestionAttachmentsRepository,
} from '@/domain/application/repositories/question-attachments.repository'
import { CachedQuestionAttachmentsMapper } from '@/infra/persistence/mappers/cached/cached-question-attachments.mapper'
import type { RedisService } from '@/infra/providers/cache/redis-service'
import type {
  QuestionAttachment,
  QuestionAttachmentProps,
} from '@/domain/enterprise/entities/question-attachment.entity'

export class CachedQuestionAttachmentsRepository implements QuestionAttachmentsRepository {
  private readonly keyPrefix = 'question-attachments'

  constructor (
    private readonly redis: RedisService,
    private readonly questionAttachmentsRepository: QuestionAttachmentsRepository
  ) {}

  async create (attachment: QuestionAttachmentProps): Promise<QuestionAttachment> {
    const created = await this.questionAttachmentsRepository.create(attachment)
    await this.redis.set(this.attachmentKey(created.id), CachedQuestionAttachmentsMapper.toCache(created))
    await this.invalidateListCache(created.questionId)
    return created
  }

  async createMany (attachments: QuestionAttachmentProps[]): Promise<QuestionAttachment[]> {
    const created = await this.questionAttachmentsRepository.createMany(attachments)
    await Promise.all(
      created.map(async (attachment) => {
        await this.redis.set(this.attachmentKey(attachment.id), CachedQuestionAttachmentsMapper.toCache(attachment))
      })
    )
    if (attachments.length > 0 && attachments[0].questionId) {
      await this.invalidateListCache(attachments[0].questionId)
    }
    return created
  }

  async findById (attachmentId: string): Promise<QuestionAttachment | null> {
    const cached = await this.redis.get(
      this.attachmentKey(attachmentId),
      CachedQuestionAttachmentsMapper.fromCacheString
    )
    if (cached) return cached
    const attachment = await this.questionAttachmentsRepository.findById(attachmentId)
    if (attachment) {
      await this.redis.set(this.attachmentKey(attachment.id), CachedQuestionAttachmentsMapper.toCache(attachment))
    }
    return attachment
  }

  async findManyByQuestionId (questionId: string, params: PaginationParams): Promise<PaginatedQuestionAttachments> {
    const key = this.redis.listKey(this.keyPrefix, { questionId, ...params })
    const cached = await this.redis.get(key, CachedQuestionAttachmentsMapper.fromPaginatedCacheString)
    if (cached) return cached
    const attachments = await this.questionAttachmentsRepository.findManyByQuestionId(questionId, params)
    await this.redis.set(key, CachedQuestionAttachmentsMapper.toPaginatedCache(attachments))
    return attachments
  }

  async update (
    attachmentId: string,
    data: Partial<Pick<QuestionAttachment, 'title' | 'link'>>
  ): Promise<QuestionAttachment> {
    const attachment = await this.questionAttachmentsRepository.findById(attachmentId)
    const updated = await this.questionAttachmentsRepository.update(attachmentId, data)
    await this.redis.set(this.attachmentKey(updated.id), CachedQuestionAttachmentsMapper.toCache(updated))
    if (attachment) {
      await this.invalidateListCache(attachment.questionId)
    }
    return updated
  }

  async delete (attachmentId: string): Promise<void> {
    const attachment = await this.questionAttachmentsRepository.findById(attachmentId)
    await this.questionAttachmentsRepository.delete(attachmentId)
    await this.redis.delete(this.attachmentKey(attachmentId))
    if (attachment) {
      await this.invalidateListCache(attachment.questionId)
    }
  }

  async deleteMany (attachmentIds: string[]): Promise<void> {
    const attachments = await Promise.all(attachmentIds.map((id) => this.questionAttachmentsRepository.findById(id)))
    await this.questionAttachmentsRepository.deleteMany(attachmentIds)
    await Promise.all(attachmentIds.map((id) => this.redis.delete(this.attachmentKey(id))))
    const questionIds = [...new Set(attachments.filter((a) => a).map((a) => a!.questionId))]
    await Promise.all(questionIds.map((questionId) => this.invalidateListCache(questionId)))
  }

  private attachmentKey (id: string): string {
    return this.redis.entityKey(this.keyPrefix, id)
  }

  private async invalidateListCache (questionId: string): Promise<void> {
    const pattern = `${this.keyPrefix}:list:*questionId=${questionId}*`
    await this.redis.deletePattern(pattern)
  }
}
