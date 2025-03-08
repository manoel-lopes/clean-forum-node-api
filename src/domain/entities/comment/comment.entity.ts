import { Entity } from '@/core/domain/entity'

export abstract class Comment extends Entity {
  readonly authorId: string
  readonly content: string
}
