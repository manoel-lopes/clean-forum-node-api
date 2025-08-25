import type { Optional } from '@/util/types/optional'
import type { Question } from '../question.entity'

export type QuestionProps = Optional<Omit<Question, 'id' | 'slug' | 'answers'>, 'createdAt' | 'updatedAt' | 'bestAnswerId'>
