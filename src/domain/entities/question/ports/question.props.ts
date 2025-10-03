import type { Question } from '../question.entity'
import type { Optional } from '@/shared/types/common/optional'
import type { Props } from '@/shared/types/custom/props'

export type QuestionProps = Optional<Omit<Props<typeof Question>, 'slug' | 'answers'>, 'bestAnswerId'>
