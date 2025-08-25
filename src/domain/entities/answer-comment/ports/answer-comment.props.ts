import type { CommentProps } from '@/domain/entities/comment/ports/comment.props'

export type AnswerCommentProps = CommentProps & {
  answerId: string
}
