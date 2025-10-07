import type { Entity } from '@/core/domain/entity'
import type { Optional } from '@/shared/types/common/optional'
import type { Props } from '@/shared/types/custom/props'

export type AnswerProps = Optional<Props<Answer>, 'excerpt'>

export type Answer = Entity & {
  content: string
  questionId: string
  authorId: string
  excerpt: string
}
