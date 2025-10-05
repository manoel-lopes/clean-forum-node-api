import { Entity } from '@/core/domain/entity'
import type { Props } from '@/shared/types/custom/props'

export type CommentProps = Props<typeof Comment>

export abstract class Comment extends Entity {
  readonly authorId: string
  readonly content: string

  constructor (props: CommentProps, id?: string) {
    super(id)
    Object.assign(this, props)
  }
}
