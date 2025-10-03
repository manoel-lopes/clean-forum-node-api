import type { Optional } from '@/shared/types/common/optional'
import type { Question } from '../question.entity'

export type QuestionProps = Optional<Omit<Question, 'id' | 'slug' | 'answers'>, 'createdAt' | 'updatedAt' | 'bestAnswerId'>
