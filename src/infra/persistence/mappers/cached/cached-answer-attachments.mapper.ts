/* eslint-disable @typescript-eslint/consistent-type-assertions */
import type { PaginatedAnswerAttachments } from '@/domain/application/repositories/answer-attachments.repository'
import type { AnswerAttachment } from '@/domain/enterprise/entities/answer-attachment.entity'
import { BaseCachedMapper } from './base/base-cached-mapper'

type CachedAnswerAttachment = {
  id: string
  answerId: string
  title: string
  link: string
  createdAt: string
  updatedAt: string
}

type CachedPaginatedAnswerAttachments = {
  items: CachedAnswerAttachment[]
  totalItems: number
  page: number
  pageSize: number
  totalPages: number
  order: 'asc' | 'desc'
}

export class CachedAnswerAttachmentsMapper extends BaseCachedMapper {
  static toDomain (raw: CachedAnswerAttachment): AnswerAttachment {
    return {
      id: raw.id,
      answerId: raw.answerId,
      title: raw.title,
      link: raw.link,
      createdAt: this.parseDate(raw.createdAt),
      updatedAt: this.parseDate(raw.updatedAt)
    }
  }

  static toCache (attachment: AnswerAttachment): string {
    const cached: CachedAnswerAttachment = {
      id: attachment.id,
      answerId: attachment.answerId,
      title: attachment.title,
      link: attachment.link,
      createdAt: this.formatDate(attachment.createdAt),
      updatedAt: this.formatDate(attachment.updatedAt)
    }
    return JSON.stringify(cached)
  }

  static toPaginatedDomain (raw: CachedPaginatedAnswerAttachments): PaginatedAnswerAttachments {
    return {
      items: raw.items.map(item => this.toDomain(item)),
      totalItems: raw.totalItems,
      page: raw.page,
      pageSize: raw.pageSize,
      totalPages: raw.totalPages,
      order: raw.order
    }
  }

  static toPaginatedCache (paginated: PaginatedAnswerAttachments): string {
    const cached: CachedPaginatedAnswerAttachments = {
      items: paginated.items.map(item => JSON.parse(this.toCache(item)) as CachedAnswerAttachment),
      totalItems: paginated.totalItems,
      page: paginated.page,
      pageSize: paginated.pageSize,
      totalPages: paginated.totalPages,
      order: paginated.order
    }
    return JSON.stringify(cached)
  }
}
