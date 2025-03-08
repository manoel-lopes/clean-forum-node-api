import {
  QuestionComment
} from '@/infra/persistence/typeorm/data-mappers/question-comment/question-comment.mapper'

export function makeQuestionComment (
  questionId: string,
  override: Partial<QuestionComment> = {}
): QuestionComment {
  const comment = QuestionComment.create({
    content: 'any_question_content',
    authorId: 'any_author_id',
    questionId: 'any_question_id'
  })
  return Object.assign(comment, { questionId, ...override })
}
