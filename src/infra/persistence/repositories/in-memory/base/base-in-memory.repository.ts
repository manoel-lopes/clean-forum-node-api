import type { Entity } from '@/core/domain/entity'

export abstract class BaseInMemoryRepository<Item extends Entity> {
  protected items: Item[] = []

  async save (item: Item): Promise<void> {
    this.items.push(item)
  }

  protected async findOneBy<Value>(key: keyof Item, value: Value): Promise<Item | null> {
    return this.items.find((item) => item[key] === value) || null
  }

  protected async deleteOneBy<Value>(key: keyof Item, value: Value): Promise<void> {
    this.items = this.items.filter((item) => item[key] !== value)
  }

  protected async updateOne (itemData: Partial<Item>): Promise<Item> {
    const { id: itemId, ...data } = itemData
    const index = this.items.findIndex((item) => item.id === itemId)
    const item = this.items[index]
    const updatedItem = { ...item, ...this.cleanData(data) }
    this.items[index] = updatedItem
    return updatedItem
  }

  private cleanData (data: Omit<Partial<Item>, 'id'>) {
    return Object.fromEntries(Object.entries(data).filter(([_, value]) => value))
  }
}
