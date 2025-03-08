import type { Comment } from '@/domain/entities/comment/comment.entity'

export interface QuestionComment extends Comment {
  questionId: string
}
