import type { PaginatedItems } from '@/core/domain/application/paginated-items'
import type { Entity } from '@/core/domain/entity'
import type { Optional } from '@/shared/types/common/optional'
import type { Props } from '@/shared/types/custom/props'
import type { Answer } from './answer.entity'
import type { QuestionAttachment } from './question-attachment.entity'
import type { QuestionComment } from './question-comment.entity'
import type { User } from './user.entity'

export type QuestionProps = Optional<Omit<Props<Question>, 'answers' | 'comments' | 'attachments' | 'author'>, 'bestAnswerId'>

export interface Question extends Entity {
  authorId: string
  title: string
  content: string
  slug: string
  bestAnswerId?: string | null
  answers?: Required<PaginatedItems<Answer>>
  comments?: QuestionComment[]
  attachments?: QuestionAttachment[]
  author?: Omit<User, 'password'>
}
