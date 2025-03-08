import {
  QuestionComment
} from '@/infra/persistence/typeorm/data-mappers/question-comment/question-comment.models'

export function makeQuestionComment (
  questionId: string,
  override: Partial<QuestionComment> = {}
): QuestionComment {
  const comment = QuestionComment.create({
    content: 'any_question_content',
    authorId: 'any_author_id',
    questionId
  })
  return Object.assign(comment, { questionId, ...override })
}
