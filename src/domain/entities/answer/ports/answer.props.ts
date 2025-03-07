import type { OmitIdAndTimestamps } from '@/util/types/omit-id-and-timestamps'
import type { Answer } from '../answer.entity'

export type AnswerProps = OmitIdAndTimestamps<Omit<Answer, 'excerpt'>>
