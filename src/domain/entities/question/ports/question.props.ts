import type { OmitIdAndTimestamps } from '@/util/types/omit-id-and-timestamps'
import type { Question } from '../question.entity'

export type QuestionProps = OmitIdAndTimestamps<Omit<Question, 'slug'>>
