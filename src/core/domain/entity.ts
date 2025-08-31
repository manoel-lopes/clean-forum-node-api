
import { uuidv7 } from 'uuidv7'

export abstract class Entity {
  readonly id: string
  readonly createdAt: Date
  readonly updatedAt?: Date

  constructor (id?: string) {
    this.id = id ?? uuidv7()
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }
}
