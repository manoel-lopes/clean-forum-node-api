import { Comment, type CommentProps } from '../comment/comment.mapper'

export type QuestionCommentProps = CommentProps & { questionId: string }

export class QuestionComment extends Comment<QuestionCommentProps> {
  declare readonly questionId?: string

  static create (props: QuestionCommentProps): QuestionComment {
    return new QuestionComment({
      content: props.content,
      authorId: props.authorId,
      questionId: props.questionId
    })
  }
}
