import { Comment } from '../comment/comment.entity'
import type { AnswerCommentProps } from './ports/answer-comment.props'

export class AnswerComment extends Comment {
  readonly answerId: string

  private constructor (props: AnswerCommentProps, id?: string) {
    super(props, id)
    Object.assign(this, props)
  }

  static create (props: AnswerCommentProps, id?: string) {
    return new AnswerComment(props, id)
  }
}
