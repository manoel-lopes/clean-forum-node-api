import type { Comment } from '@/domain/entities/comment/comment.entity'

export interface AnswerComment extends Comment {
  answerId: string
}
