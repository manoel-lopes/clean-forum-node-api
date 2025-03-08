import { Column } from 'typeorm'
import { BaseDataMapper } from '../base/base-data-mapper'
import type { CommentProps } from './ports/comment.props'

export class Comment extends BaseDataMapper {
  @Column({ type: 'varchar' })
  readonly content: string

  @Column({ name: 'author_id', type: 'uuid' })
  readonly authorId: string

  private constructor (props: CommentProps) {
    super()
    Object.assign(this, props)
  }

  static create (props: CommentProps) {
    const { content, authorId } = props
    return new Comment({ authorId, content })
  }
}
