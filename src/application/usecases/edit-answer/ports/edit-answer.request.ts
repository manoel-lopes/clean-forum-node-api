import type { UpdateAnswerData } from '@/application/repositories/answers.repository'
import type { Rename } from '@/util/types/rename'

export type EditAnswerRequest = Rename<UpdateAnswerData, 'id', 'answerId'>
