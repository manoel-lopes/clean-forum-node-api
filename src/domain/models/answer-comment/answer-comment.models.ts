import type { Comment } from '@/infra/persistence/typeorm/data-mappers/comment/comment.mapper'

export interface AnswerComment extends Comment {
  answerId: string
}
