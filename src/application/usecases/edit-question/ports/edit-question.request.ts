import type { UpdateQuestionData } from '@/application/repositories/questions.repository'
import type { Rename } from '@/util/types/rename'

export type EditQuestionRequest = Rename<UpdateQuestionData, 'id', 'questionId'>
