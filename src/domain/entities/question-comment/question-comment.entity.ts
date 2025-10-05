import { Comment, type CommentProps } from '../comment/comment.entity'

export type QuestionCommentProps = CommentProps & {
  questionId: string
}

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
