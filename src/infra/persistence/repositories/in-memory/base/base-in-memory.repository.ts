import type { PaginatedItems } from '@/core/application/paginated-items'
import type { PaginationParams } from '@/core/application/pagination-params'
import type { Entity } from '@/core/domain/entity'

type UpdateItemData<Item extends Entity> = {
  where: { id?: string }
  data: Omit<Partial<Item>, 'id'>
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
    const items = this.items
      .sort((a, b) => order === 'asc'
        ? a.createdAt.getTime() - b.createdAt.getTime()
        : b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * pageSize, page * pageSize)
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

  protected async findOneBy<Value>(key: keyof Item, value: Value): Promise<Item | null> {
    return this.items.find((item) => item[key] === value) || null
  }

  protected async deleteOneBy<Value>(key: keyof Item, value: Value): Promise<void> {
    this.items = this.items.filter((item) => item[key] !== value)
  }

  async updateOne (itemData: UpdateItemData<Item>): Promise<Item> {
    const { where, data } = itemData
    let index = -1
    if (where.id) {
      index = this.items.findIndex((item) => item.id === where.id)
    }
    const item = this.items[index]
    const updatedItem = { ...item, ...this.cleanData(data) }
    this.items[index] = updatedItem
    return updatedItem
  }

  private cleanData (data: Omit<Partial<Item>, 'id'>) {
    return Object.fromEntries(Object.entries(data).filter(([_, value]) => value))
  }
}
