/* eslint-disable @typescript-eslint/consistent-type-assertions */
import type { PaginatedQuestionAttachments } from '@/domain/application/repositories/question-attachments.repository'
import type { QuestionAttachment } from '@/domain/enterprise/entities/question-attachment.entity'
import { BaseCachedMapper } from './base/base-cached-mapper'

type CachedQuestionAttachment = {
  id: string
  questionId: string
  title: string
  link: string
  createdAt: string
  updatedAt: string
}

type CachedPaginatedQuestionAttachments = {
  items: CachedQuestionAttachment[]
  totalItems: number
  page: number
  pageSize: number
  totalPages: number
  order: 'asc' | 'desc'
}

export class CachedQuestionAttachmentsMapper extends BaseCachedMapper {
  static toDomain (raw: CachedQuestionAttachment): QuestionAttachment {
    return {
      id: raw.id,
      questionId: raw.questionId,
      title: raw.title,
      link: raw.link,
      createdAt: this.parseDate(raw.createdAt),
      updatedAt: this.parseDate(raw.updatedAt)
    }
  }

  static toCache (attachment: QuestionAttachment): string {
    const cached: CachedQuestionAttachment = {
      id: attachment.id,
      questionId: attachment.questionId,
      title: attachment.title,
      link: attachment.link,
      createdAt: this.formatDate(attachment.createdAt),
      updatedAt: this.formatDate(attachment.updatedAt)
    }
    return JSON.stringify(cached)
  }

  static toPaginatedDomain (raw: CachedPaginatedQuestionAttachments): PaginatedQuestionAttachments {
    return {
      items: raw.items.map(item => this.toDomain(item)),
      totalItems: raw.totalItems,
      page: raw.page,
      pageSize: raw.pageSize,
      totalPages: raw.totalPages,
      order: raw.order
    }
  }

  static toPaginatedCache (paginated: PaginatedQuestionAttachments): string {
    const cached: CachedPaginatedQuestionAttachments = {
      items: paginated.items.map(item => JSON.parse(this.toCache(item)) as CachedQuestionAttachment),
      totalItems: paginated.totalItems,
      page: paginated.page,
      pageSize: paginated.pageSize,
      totalPages: paginated.totalPages,
      order: paginated.order
    }
    return JSON.stringify(cached)
  }
}
