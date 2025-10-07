import type { Props } from '@/shared/types/custom/props'
import type { Comment } from './base/comment.entity'

export type QuestionCommentProps = Props<QuestionComment>

export type QuestionComment = Comment & {
  questionId: string
}
