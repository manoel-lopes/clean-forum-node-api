import { Entity } from '@/core/domain/entity'
import type { CommentProps } from './ports/comment.props'

export class Comment extends Entity {
  private constructor (
    readonly authorId: string,
    readonly content: string
  ) {
    super()
  }

  static create (props: CommentProps) {
    const { authorId, content } = props
    return new Comment(authorId, content)
  }
}
