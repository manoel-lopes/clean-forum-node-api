import { Comment } from '@/domain/entities/comment/comment.entity'
import type { QuestionComment } from '@/domain/models/question-comment/question-comment.models'

export function makeQuestionComment (
  questionId: string,
  override: Partial<QuestionComment> = {}
): QuestionComment {
  const comment = Comment.create({
    content: 'any_question_content',
    authorId: 'any_author_id',
  })
  return Object.assign(comment, { questionId, ...override })
}
