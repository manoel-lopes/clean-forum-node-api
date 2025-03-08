import type { AnswerProps } from './ports/answer.props'
import { BaseDataMapper } from '../base/base-data-mapper'
import { Column } from 'typeorm'

export class Answer extends BaseDataMapper {
  @Column({ type: 'varchar' })
  readonly content: string

  @Column({ name: 'author_id', type: 'uuid' })
  readonly authorId: string

  @Column({ name: 'question_id', type: 'uuid' })
  readonly questionId: string

  private constructor (data: AnswerProps) {
    super()
    Object.assign(this, data)
  }

  get excerpt () {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  static create (props: AnswerProps) {
    const { content, questionId, authorId } = props
    return new Answer({ content, questionId, authorId })
  }
}
