import type { Answer } from '../answer.entity'
import type { Optional } from '@/shared/types/common/optional'
import type { Props } from '@/shared/types/custom/props'

export type AnswerProps = Optional<Props<typeof Answer>, 'excerpt'>
