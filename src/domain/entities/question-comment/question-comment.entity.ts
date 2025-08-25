import { Comment } from '../comment/comment.entity'
import type { QuestionCommentProps } from './ports/question-comment.props'

export class QuestionComment extends Comment {
  readonly questionId: string

  private constructor (props: QuestionCommentProps, id?: string) {
    super(props, id)
    Object.assign(this, props)
  }

  static create (props: QuestionCommentProps, id?: string) {
    return new QuestionComment(props, id)
  }
}
