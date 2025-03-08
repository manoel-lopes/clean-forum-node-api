import { Comment, type CommentProps } from '../comment/comment.mapper'

export type AnswerCommentProps = CommentProps & { answerId: string }

export class AnswerComment extends Comment<AnswerCommentProps> {
  declare readonly answerId?: string

  static create (props: AnswerCommentProps): AnswerComment {
    return new AnswerComment({
      content: props.content,
      authorId: props.authorId,
      answerId: props.answerId
    })
  }
}
