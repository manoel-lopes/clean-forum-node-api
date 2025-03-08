import { Comment } from '../comment/comment.mapper'
import type { AnswerCommentProps } from './ports/answer-comment.props'

export class AnswerComment extends Comment {
  declare readonly answerId: string

  private constructor (props: AnswerCommentProps) {
    super()
    Object.assign(this, props)
  }

  static create (props: AnswerCommentProps) {
    const { content, authorId, answerId } = props
    return new AnswerComment({ content, authorId, answerId })
  }
}
