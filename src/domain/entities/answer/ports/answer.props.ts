import type { Answer } from '../answer.entity'
import type { Optional } from '@/shared/types/common/optional'

export type AnswerProps = Optional<Omit<Answer, 'id' | 'excerpt'>, 'createdAt' | 'updatedAt'>
