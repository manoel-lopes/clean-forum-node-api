import { Comment } from '@/domain/entities/comment/comment.entity'
import type { AnswerComment } from '@/domain/models/answer-comment/answer-comment.model'

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
