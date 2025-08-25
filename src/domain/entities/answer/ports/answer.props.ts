import type { Optional } from '@/util/types/optional'
import type { Answer } from '../answer.entity'

export type AnswerProps = Optional<Omit<Answer, 'id' | 'excerpt'>, 'createdAt' | 'updatedAt'>
