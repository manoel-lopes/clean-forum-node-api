import type { CommentProps } from '@/infra/persistence/typeorm/data-mappers/comment/ports/comment.props'

export type QuestionCommentProps = CommentProps & { questionId: string }
