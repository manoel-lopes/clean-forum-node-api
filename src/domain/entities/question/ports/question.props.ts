import type { Question } from '../question.entity'
import type { Optional } from '@/shared/types/common/optional'

export type QuestionProps = Optional<Omit<Question, 'id' | 'slug' | 'answers'>, 'createdAt' | 'updatedAt' | 'bestAnswerId'>
