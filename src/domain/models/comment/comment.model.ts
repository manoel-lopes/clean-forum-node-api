import { Entity } from '@/core/domain/entity'

export abstract class Comment extends Entity {
  constructor (
    readonly authorId: string,
    readonly content: string,
    id?: string
  ) {
    super(id)
  }
}
