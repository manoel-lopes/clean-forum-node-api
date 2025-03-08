import { AnswerComment } from '@/domain/entities/answer-comment/answer-comment.entity'

export function makeAnswerComment (
  answerId: string,
  override: Partial<AnswerComment> = {}
): AnswerComment {
  const comment = AnswerComment.create({
    content: 'any_question_content',
    authorId: 'any_author_id',
    answerId
  })
  return Object.assign(comment, { answerId, ...override })
}
