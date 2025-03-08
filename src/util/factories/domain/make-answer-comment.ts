import {
  AnswerComment
} from '@/infra/persistence/typeorm/data-mappers/answer-comment/answer-comment.mapper'

export function makeAnswerComment (
  answerId: string,
  override: Partial<AnswerComment> = {}
): AnswerComment {
  const comment = AnswerComment.create({
    content: 'any_answer_content',
    authorId: 'any_author_id',
    answerId: 'any_answer_id'
  })
  return Object.assign(comment, { answerId, ...override })
}
