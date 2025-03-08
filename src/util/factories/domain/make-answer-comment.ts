import { Comment } from '@/infra/persistence/typeorm/data-mappers/comment/comment.mapper'
import type { AnswerComment } from '@/domain/models/answer-comment/answer-comment.models'

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
