import type { Entity } from '@/core/domain/entity'
import type { Props } from '@/shared/types/custom/props'

export type CommentProps = Props<Comment>

export type Comment = Entity & {
  authorId: string
  content: string
}
