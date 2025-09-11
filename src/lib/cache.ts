import type { Entity } from '@/core/domain/entity'
import type { Mutable } from '@/util/types/mutable'

export type Item = Mutable<Entity>

export type PaginatedResult<T> = {
  items: T[]
}

export const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null
}

export const hasStringId = (record: Record<string, unknown>): record is Record<string, unknown> & { id: string } => {
  return 'id' in record && typeof record.id === 'string'
}

export const hasItemsArray = (record: Record<string, unknown>): record is Record<string, unknown> & { items: unknown[] } => {
  return 'items' in record && Array.isArray(record.items)
}

export const convertToDate = (value: unknown): Date =>
  typeof value === 'string' ? new Date(value)
    : value instanceof Date ? value : new Date()

export const buildItem = (data: Record<string, unknown> & { id: string }): Item => ({
  ...data,
  id: data.id,
  createdAt: convertToDate(data.createdAt),
  updatedAt: convertToDate(data.updatedAt)
})

export const safeCreateItem = (data: Record<string, unknown> & { id: string }) => {
  try {
    return buildItem(data)
  } catch {
    return null
  }
}

export const isValidEntity = <T extends Item>(item: Entity): item is T => {
  return typeof item.id === 'string'
}

export const parseJson = (text: string) => {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}
