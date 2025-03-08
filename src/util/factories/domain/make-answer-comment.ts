import { Comment } from '@/domain/entities/comment/comment.entity'
import type { AnswerComment } from '@/infra/persistence/typeorm/data-mappers/answer-comment/answer-comment.mapper'

export function makeAnswerComment (
  answerId: string,
  override: Partial<AnswerComment> = {}
): AnswerComment {
  const comment = Comment.create({
    content: 'any_question_content',
    authorId: 'any_author_id',
  })
  return Object.assign(comment, { answerId, ...override })
}
