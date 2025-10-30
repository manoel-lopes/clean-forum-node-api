import type { Entity } from '@/core/domain/entity'
import type { Props } from '@/shared/types/custom/props'
import type { AnswerAttachment } from './answer-attachment.entity'
import type { AnswerComment } from './answer-comment.entity'
import type { User } from './user.entity'

export type AnswerProps = Omit<Props<Answer>, 'comments' | 'attachments' | 'author'>

export interface Answer extends Entity {
  content: string
  questionId: string
  authorId: string
  excerpt: string
  comments?: AnswerComment[]
  attachments?: AnswerAttachment[]
  author?: Omit<User, 'password'>
}
