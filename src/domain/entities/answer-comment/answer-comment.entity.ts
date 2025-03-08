import { Comment } from '../comment/comment.entity'
import type { AnswerCommentProps } from './ports/answer-comment.props'

export class AnswerComment extends Comment {
  readonly answerId: string

  private constructor (props: AnswerCommentProps) {
    super()
    Object.assign(this, props)
  }

  static create (props: AnswerCommentProps) {
    const { content, authorId, answerId } = props
    return new AnswerComment({ content, authorId, answerId })
  }
}
