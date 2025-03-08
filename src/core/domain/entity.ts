import { uuidv7 } from 'uuidv7'

export abstract class Entity<Props> {
  readonly id: string = uuidv7()
  readonly createdAt = new Date()
  readonly updatedAt? = new Date()

  protected constructor (data: Props) {
    Object.assign(this, data)
  }
}
