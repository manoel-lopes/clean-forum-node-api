import { Column } from 'typeorm'
import { Comment } from '../comment/comment.mapper'
import type { QuestionCommentProps } from './ports/question-comment.props'

export class QuestionComment extends Comment {
  @Column({ name: 'question_id', type: 'uuid' })
  readonly questionId: string

  private constructor (props: QuestionCommentProps) {
    super()
    Object.assign(this, props)
  }

  static create (props: QuestionCommentProps) {
    const { content, authorId, questionId } = props
    return new QuestionComment({ content, authorId, questionId })
  }
}
