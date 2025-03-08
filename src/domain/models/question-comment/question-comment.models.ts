import type { Comment } from '@/infra/persistence/typeorm/data-mappers/comment/comment.mapper'

export interface QuestionComment extends Comment {
  questionId: string
}
