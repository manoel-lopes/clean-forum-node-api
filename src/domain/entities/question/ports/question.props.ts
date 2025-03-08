import type { OmitIdAndTimestamps } from '@/util/types/omit-id-and-timestamps'
import type { Optional } from '@/util/types/optional'
import type { Question } from '../question.entity'

export type QuestionProps = OmitIdAndTimestamps<Optional<Omit<Question, 'slug'>, 'bestAnswerId'>>
