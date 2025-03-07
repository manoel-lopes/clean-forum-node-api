import type {
  UpdateQuestionCommentData
} from '@/application/repositories/question-comments.repository'
import type { Rename } from '@/util/types/rename'

export type EditQuestionCommentRequest = Rename<UpdateQuestionCommentData, 'id', 'commentId'>
