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

function isCachedAnswerAttachment (value: unknown): value is CachedAnswerAttachment {
  if (typeof value !== 'object' || value === null) return false
  if (
    !('id' in value) ||
    !('answerId' in value) ||
    !('title' in value) ||
    !('link' in value) ||
    !('createdAt' in value) ||
    !('updatedAt' in value)
  ) {
    return false
  }
  return (
    typeof value.id === 'string' &&
    typeof value.answerId === 'string' &&
    typeof value.title === 'string' &&
    typeof value.link === 'string' &&
    typeof value.createdAt === 'string' &&
    typeof value.updatedAt === 'string'
  )
}

function isCachedPaginatedAnswerAttachments (value: unknown): value is CachedPaginatedAnswerAttachments {
  if (typeof value !== 'object' || value === null) return false
  if (
    !('items' in value) ||
    !('totalItems' in value) ||
    !('page' in value) ||
    !('pageSize' in value) ||
    !('totalPages' in value) ||
    !('order' in value)
  ) {
    return false
  }
  return (
    Array.isArray(value.items) &&
    typeof value.totalItems === 'number' &&
    typeof value.page === 'number' &&
    typeof value.pageSize === 'number' &&
    typeof value.totalPages === 'number' &&
    (value.order === 'asc' || value.order === 'desc')
  )
}

export class CachedAnswerAttachmentsMapper extends BaseCachedMapper {
  static fromCacheString (cache: string): AnswerAttachment {
    const parsed: unknown = JSON.parse(cache)
    if (!isCachedAnswerAttachment(parsed)) {
      throw new Error('Invalid cached answer attachment')
    }
    return this.toDomain(parsed)
  }

  static fromPaginatedCacheString (cache: string): PaginatedAnswerAttachments {
    const parsed: unknown = JSON.parse(cache)
    if (!isCachedPaginatedAnswerAttachments(parsed)) {
      throw new Error('Invalid cached paginated answer attachments')
    }
    return this.toPaginatedDomain(parsed)
  }

  static toDomain (raw: CachedAnswerAttachment): AnswerAttachment {
    return {
      id: raw.id,
      answerId: raw.answerId,
      title: raw.title,
      link: raw.link,
      createdAt: this.parseDate(raw.createdAt),
      updatedAt: this.parseDate(raw.updatedAt),
    }
  }

  static toCache (attachment: AnswerAttachment): string {
    const cached: CachedAnswerAttachment = {
      id: attachment.id,
      answerId: attachment.answerId,
      title: attachment.title,
      link: attachment.link,
      createdAt: this.formatDate(attachment.createdAt),
      updatedAt: this.formatDate(attachment.updatedAt),
    }
    return JSON.stringify(cached)
  }

  static toPaginatedDomain (raw: CachedPaginatedAnswerAttachments): PaginatedAnswerAttachments {
    return {
      items: raw.items.map((item) => this.toDomain(item)),
      totalItems: raw.totalItems,
      page: raw.page,
      pageSize: raw.pageSize,
      totalPages: raw.totalPages,
      order: raw.order,
    }
  }

  static toPaginatedCache (paginated: PaginatedAnswerAttachments): string {
    const cachedItems: CachedAnswerAttachment[] = paginated.items.map((item) => ({
      id: item.id,
      answerId: item.answerId,
      title: item.title,
      link: item.link,
      createdAt: this.formatDate(item.createdAt),
      updatedAt: this.formatDate(item.updatedAt),
    }))
    const cached: CachedPaginatedAnswerAttachments = {
      items: cachedItems,
      totalItems: paginated.totalItems,
      page: paginated.page,
      pageSize: paginated.pageSize,
      totalPages: paginated.totalPages,
      order: paginated.order,
    }
    return JSON.stringify(cached)
  }
}
