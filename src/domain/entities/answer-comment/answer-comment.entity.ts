import { Comment, type CommentProps } from '../comment/comment.entity'

export type AnswerCommentProps = CommentProps & {
  answerId: string
}

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
