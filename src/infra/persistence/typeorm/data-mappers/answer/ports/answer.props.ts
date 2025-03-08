import type { OmitIdAndTimestamps } from '@/util/types/omit-id-and-timestamps'
import type { Answer } from '../answer.mapper'

export type AnswerProps = OmitIdAndTimestamps<Omit<Answer, 'excerpt'>>
