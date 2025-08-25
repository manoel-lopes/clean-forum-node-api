import { Entity } from '@/core/domain/entity'
import type { CommentProps } from './ports/comment.props'

export abstract class Comment extends Entity {
  readonly authorId: string
  readonly content: string

  constructor (props: CommentProps, id?: string) {
    super(id)
    Object.assign(this, props)
  }
}
