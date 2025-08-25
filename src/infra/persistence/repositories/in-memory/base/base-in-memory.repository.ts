import type { PaginatedItems } from '@/core/application/paginated-items'
import type { PaginationParams } from '@/core/application/pagination-params'
import type { Entity } from '@/core/domain/entity'

export type UpdateItemData<Item> = Partial<Record<keyof Item, unknown>>

type UpdateItem<Item> = {
  where: {
    [key in keyof Item]?: Item[key]
  }
  data: UpdateItemData<Item>
}

export abstract class BaseInMemoryRepository<Item extends Entity> {
  protected items: Item[] = []

  async save (item: Item): Promise<void> {
    this.items.push(item)
  }

  async findById (id: string): Promise<Item | null> {
    return this.items.find((item) => item.id === id) || null
  }

  async delete (id: string): Promise<void> {
    this.items = this.items.filter((item) => item.id !== id)
  }

  protected async findManyItems ({
    page = 1,
    pageSize = 20,
    order = 'desc'
  }: PaginationParams): Promise<PaginatedItems<Item>> {
    const items = this.sortItems(this.items, order).slice((page - 1) * pageSize, page * pageSize)
    const totalItems = this.items.length
    const totalPages = Math.ceil(totalItems / pageSize)
    return {
      page,
      pageSize: Math.min(pageSize, totalItems),
      totalItems,
      totalPages,
      items,
      order
    }
  }

  protected async findManyItemsBy ({
    where,
    params
  }: {
    where: {
      [key in keyof Item]?: Item[key]
    }
    params: PaginationParams
  }): Promise<PaginatedItems<Item>> {
    const { page = 1, pageSize = 20, order = 'desc' } = params
    const filteredItems = this.filterItems(this.items, where)
    const items = this.sortItems(filteredItems, order).slice((page - 1) * pageSize, page * pageSize)
    const totalItems = filteredItems.length
    const totalPages = Math.ceil(totalItems / pageSize)
    return {
      page,
      pageSize: Math.min(pageSize, totalItems),
      totalItems,
      totalPages,
      items,
      order
    }
  }

  private filterItems (items: Item[], where: {
    [key in keyof Item]?: Item[key]
  }): Item[] {
    return items.filter((item) => Object.entries(where).every(([key, value]) => {
      return item[key as keyof Item] === value
    }))
  }

  private sortItems (items: Item[], order: 'asc' | 'desc'): Item[] {
    return items.sort((a, b) => order === 'asc'
      ? a.createdAt.getTime() - b.createdAt.getTime()
      : b.createdAt.getTime() - a.createdAt.getTime())
  }

  protected async findOneBy<Value>(key: keyof Item, value: Value): Promise<Item | null> {
    return this.items.find((item) => item[key] === value) || null
  }

  protected async deleteOneBy<Value>(key: keyof Item, value: Value): Promise<void> {
    this.items = this.items.filter((item) => item[key] !== value)
  }

  async updateOne (itemData: UpdateItem<Item>): Promise<Item> {
    const { where, data } = itemData
    let index = -1
    if (where.id) {
      index = this.items.findIndex((item) => item.id === where.id)
    }

    if (index === -1) {
      throw new Error('Item not found')
    }
    const item = this.items[index]
    const cleanedData = this.cleanData(data)
    const updatedItem = { ...item, ...cleanedData }
    this.items[index] = updatedItem
    return updatedItem
  }

  private cleanData (data: Record<string, unknown>) {
    return Object.fromEntries(Object.entries(data).filter(([_, value]) => value))
  }

  protected paginate<T>({
    items,
    page = 1,
    pageSize = 10,
    order = 'desc',
  }: PaginationParams & { items: T[] }): PaginatedItems<T> {
    const totalItems = items.length
    const totalPages = Math.ceil(totalItems / pageSize)
    const actualPageSize = Math.min(pageSize, totalItems)

    const sortedItems = items.sort((a, b) => {
      if (
        order === 'asc' &&
        typeof a === 'object' &&
        a &&
        'createdAt' in a &&
        a.createdAt instanceof Date &&
        typeof b === 'object' &&
        b &&
        'createdAt' in b &&
        b.createdAt instanceof Date
      ) {
        return a.createdAt.getTime() - b.createdAt.getTime()
      } else if (
        order === 'desc' &&
        typeof a === 'object' &&
        a &&
        'createdAt' in a &&
        a.createdAt instanceof Date &&
        typeof b === 'object' &&
        b &&
        'createdAt' in b &&
        b.createdAt instanceof Date
      ) {
        return b.createdAt.getTime() - a.createdAt.getTime()
      }
      return 0
    })

    const paginatedItems = sortedItems.slice(
      (page - 1) * pageSize,
      page * pageSize
    )

    return {
      page,
      pageSize: actualPageSize,
      totalItems,
      totalPages,
      order,
      items: paginatedItems,
    }
  }
}
