import type {
  UpdateAnswerCommentData
} from '@/application/repositories/answer-comments.repository'
import type { Rename } from '@/util/types/rename'

export type EditAnswerCommentRequest = Rename<UpdateAnswerCommentData, 'id', 'commentId'>
