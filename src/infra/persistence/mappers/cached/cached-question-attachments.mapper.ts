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

function isCachedQuestionAttachment (value: unknown): value is CachedQuestionAttachment {
  if (typeof value !== 'object' || value === null) return false
  if (!('id' in value) || !('questionId' in value) || !('title' in value) ||
      !('link' in value) || !('createdAt' in value) || !('updatedAt' in value)) {
    return false
  }
  return typeof value.id === 'string' &&
    typeof value.questionId === 'string' &&
    typeof value.title === 'string' &&
    typeof value.link === 'string' &&
    typeof value.createdAt === 'string' &&
    typeof value.updatedAt === 'string'
}

function isCachedPaginatedQuestionAttachments (value: unknown): value is CachedPaginatedQuestionAttachments {
  if (typeof value !== 'object' || value === null) return false
  if (!('items' in value) || !('totalItems' in value) || !('page' in value) ||
      !('pageSize' in value) || !('totalPages' in value) || !('order' in value)) {
    return false
  }
  return Array.isArray(value.items) &&
    typeof value.totalItems === 'number' &&
    typeof value.page === 'number' &&
    typeof value.pageSize === 'number' &&
    typeof value.totalPages === 'number' &&
    (value.order === 'asc' || value.order === 'desc')
}

export class CachedQuestionAttachmentsMapper extends BaseCachedMapper {
  static fromCacheString (cache: string): QuestionAttachment {
    const parsed: unknown = JSON.parse(cache)
    if (!isCachedQuestionAttachment(parsed)) {
      throw new Error('Invalid cached question attachment')
    }
    return this.toDomain(parsed)
  }

  static fromPaginatedCacheString (cache: string): PaginatedQuestionAttachments {
    const parsed: unknown = JSON.parse(cache)
    if (!isCachedPaginatedQuestionAttachments(parsed)) {
      throw new Error('Invalid cached paginated question attachments')
    }
    return this.toPaginatedDomain(parsed)
  }

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
    const cachedItems: CachedQuestionAttachment[] = paginated.items.map(item => ({
      id: item.id,
      questionId: item.questionId,
      title: item.title,
      link: item.link,
      createdAt: this.formatDate(item.createdAt),
      updatedAt: this.formatDate(item.updatedAt)
    }))
    const cached: CachedPaginatedQuestionAttachments = {
      items: cachedItems,
      totalItems: paginated.totalItems,
      page: paginated.page,
      pageSize: paginated.pageSize,
      totalPages: paginated.totalPages,
      order: paginated.order
    }
    return JSON.stringify(cached)
  }
}
