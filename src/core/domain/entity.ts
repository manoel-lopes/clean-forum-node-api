import { uuidv7 } from 'uuidv7'

export abstract class Entity {
  readonly id = uuidv7()
  readonly createdAt = new Date()
  readonly updatedAt?: Date = new Date()
}
